
import { LitElement, html, nothing } from "lit";

import { cardStyles } from "../styles/card.js";

import { normalizeConfig } from "../core/config.js";

import {
  getEntityState,
  getEntityValue,
  getEntityName,
  getNumericValue,
  getEntityUnit,
  isPrinterOffline,
  formatDateTime,
  formatDuration,
  getImageUrl,
  getLanguage,
  normalizeProgress
} from "../core/utils.js";

import { executeAction } from "../core/actions.js";

import { localize } from "../core/localize.js";

const MAIN_CONTROLS = [
  "pause",
  "resume",
  "cancel",
  "emergency_stop"
];

export class PrinterControlCard extends LitElement {
  static properties = {
  hass: { attribute: false },
  _config: { state: true },
  _actionError: { state: true },
  _refreshCounter: { state: true },
  __sectionOpen: { state: true },
  _cameraError: { state: true }
};

  static styles = [cardStyles];

  constructor() {
    super();

    this.hass = undefined;
    this._config = undefined;
    this._actionError = "";
    this._refreshCounter = 0;
    this._sectionOpen  = {};
    this._cameraTimer = undefined;
    this._cameraError = {};
  }

  /**
   * Domyślna konfiguracja używana przez picker HA.
   */
  static getStubConfig() {
    return {
      name: "My 3D Printer"
    };
  }

  /**
   * Edytor wizualny.
   */
  static getConfigElement() {
    return document.createElement(
      "printer-control-card-editor"
    );
  }

  /**
   * Konfiguracja instancji karty.
   */
  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error(
        "3D Printer Control Card: invalid configuration."
      );
    }

    if (!config.name || !String(config.name).trim()) {
      throw new Error(
        "3D Printer Control Card: printer name is required."
      );
    }

    this._config = normalizeConfig(config);

    this._actionError = "";
    this._sectionOpen = {};

    this._resetCameraTimer();
  }

  getCardSize() {
    const stats =
      this._config?.statistics?.length || 0;

    const cameras =
      this._config?.cameras?.length || 0;

    return 6 + Math.ceil(stats / 3) + cameras;
  }

  connectedCallback() {
    super.connectedCallback();
    this._resetCameraTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearCameraTimer();
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has("_config")) {
      this._resetCameraTimer();
    }
  }

  _clearCameraTimer() {
    if (this._cameraTimer) {
      clearInterval(this._cameraTimer);
      this._cameraTimer = undefined;
    }
  }

  /**
   * Odświeżanie obrazów kamer.
   *
   * Minimalny interwał spośród skonfigurowanych kamer.
   * Przy wartości 0 odświeżanie okresowe jest wyłączone.
   */
  _resetCameraTimer() {
    this._clearCameraTimer();

    if (!this.isConnected || !this._config) {
      return;
    }

    const intervals = (this._config.cameras || [])
      .map((camera) => Number(camera.refresh_interval || 0))
      .filter((value) => value > 0);

    if (!intervals.length) {
      return;
    }

    const refreshSeconds = Math.min(...intervals);

    this._cameraTimer = window.setInterval(() => {
      this._refreshCounter += 1;
    }, Math.max(5, refreshSeconds) * 1000);
  }

  _t(key, variables = {}) {
    return localize(this.hass, key, variables);
  }

  _entityValue(key, fallback = "—") {
    const entityId = this._config?.entities?.[key];

    return getEntityValue(
      this.hass,
      entityId,
      null,
      fallback
    );
  }

  _isOffline() {
    return isPrinterOffline(
      this.hass,
      this._config?.connection_entity,
      this._config?.offline_states
    );
  }

  _statusText() {
    const status = String(
      this._entityValue("status", "")
    ).toLowerCase();

    const statusMap = {
      printing: "printing",
      paused: "paused",
      idle: "idle",
      ready: "idle",
      standby: "idle"
    };

    const key = statusMap[status];

    return key
      ? this._t(`card.status.${key}`)
      : status || this._t("card.status.online");
  }

  _statusColor() {
    return this._isOffline()
      ? "offline"
      : "online";
  }

  _thumbnailUrl() {
    const source = this._config?.entities?.thumbnail;

    if (!source) {
      return "";
    }

    // Można podać bezpośredni URL.
    if (/^https?:\/\//i.test(source)) {
      return source;
    }

    return getImageUrl(
      this.hass,
      source,
      this.hass?.states?.[source]?.last_updated || ""
    );
  }

  _renderThumbnail() {
    const url = this._thumbnailUrl();

    if (!url) {
      return html`
        <div class="thumbnail-placeholder">
          <ha-icon icon="mdi:file-image-outline"></ha-icon>
        </div>
      `;
    }

    return html`
      <img
        class="thumbnail"
        src=${url}
        alt="Print thumbnail"
        loading="lazy"
      >
    `;
  }

  _renderHeader(offline = false) {
    return html`
      <header class="printer-header">
        <div class="printer-name">
          ${this._config.name}
        </div>

        ${this._config.appearance.show_status
          ? html`
              <div class="printer-status">
                <span class="status-dot ${offline ? "" : "online"}"></span>

                ${offline
                  ? this._t("card.status.offline")
                  : this._statusText()}
              </div>
            `
          : nothing}
      </header>
    `;
  }

  _getEstimatedEnd() {
    const configuredEnd =
      this._config.entities.estimated_end;

    const value = getEntityValue(
      this.hass,
      configuredEnd,
      null,
      ""
    );

    if (value && value !== "unknown" && value !== "unavailable") {
      return formatDateTime(
        value,
        getLanguage(this.hass)
      );
    }

    // Gdy nie ma bezpośredniej encji zakończenia,
    // próbujemy obliczyć czas z czasu pozostałego.
    const remainingEntity =
      this._config.entities.remaining_time;

    const remaining = getEntityState(
      this.hass,
      remainingEntity
    );

    if (remaining) {
      const seconds = Number(remaining.state);

      if (Number.isFinite(seconds) && seconds >= 0) {
        const date = new Date(
          Date.now() + seconds * 1000
        );

        return formatDateTime(
          date,
          getLanguage(this.hass)
        );
      }
    }

    return "—";
  }

  _renderTimeBox(label, value) {
    return html`
      <div class="time-box">
        <div class="time-label">${label}</div>
        <div class="time-value">${value || "—"}</div>
      </div>
    `;
  }

  _renderJob() {
    const entities = this._config.entities;

    const filename = getEntityValue(
      this.hass,
      entities.filename,
      null,
      this._t("card.job.no_file")
    );

    const progress = normalizeProgress(
      getNumericValue(
        this.hass,
        entities.progress,
        0
      )
    );

    const startedAt = formatDateTime(
      getEntityValue(
        this.hass,
        entities.started_at,
        null,
        ""
      ),
      getLanguage(this.hass)
    );

    const estimatedEnd = this._getEstimatedEnd();

    const remainingEntity = entities.remaining_time;

    let remaining = "—";

    if (remainingEntity) {
      const value = getEntityValue(
        this.hass,
        remainingEntity,
        null,
        ""
      );

      const seconds = Number(value);

      remaining =
        Number.isFinite(seconds)
          ? formatDuration(seconds)
          : value || "—";
    }

    const appearance = this._config.appearance;

    return html`
      <section class="job-layout ${appearance.show_thumbnails ? "" : "no-thumbnail"}">
        ${appearance.show_thumbnails
          ? this._renderThumbnail()
          : nothing}

        <div class="job-details">
          <div class="job-filename">
            ${filename}
          </div>

          ${appearance.show_progress
            ? html`
                <div class="progress-block">
                  <div class="progress-heading">
                    <span>${this._t("card.job.progress")}</span>

                    <span class="progress-number">
                      ${progress.toFixed(0)}%
                    </span>
                  </div>

                  <div
                    class="progress-track"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow=${progress}
                  >
                    <div
                      class="progress-fill ${progress >= 100 ? "complete" : ""}"
                      style=${`width:${progress}%`}
                    ></div>
                  </div>
                </div>
              `
            : nothing}

          ${appearance.show_times
            ? html`
                <div class="job-times">
                  ${this._renderTimeBox(
                    this._t("card.job.started"),
                    startedAt
                  )}

                  ${this._renderTimeBox(
                    this._t("card.job.estimated_end"),
                    estimatedEnd
                  )}

                  ${entities.remaining_time
                    ? this._renderTimeBox(
                        this._t("card.job.remaining"),
                        remaining
                      )
                    : nothing}
                </div>
              `
            : nothing}
        </div>
      </section>
    `;
  }

  _renderMainControl(key) {
  const action = this._config.controls[key];

  if (!action || action.enabled === false) {
    return nothing;
  }

  const configured = Boolean(
    action.entity || action.service
  );

  const label =
    action.label ||
    this._t(`card.controls.${key}`);

  return html`
    <button
      class="printer-button
        ${key === "cancel" ? "warning" : ""}
        ${key === "emergency_stop" ? "danger emergency" : ""}"
      ?disabled=${!configured}
      aria-label=${label}
      @click=${() =>
        this._runAction(
          action,
          key === "emergency_stop"
        )}
    >
      <ha-icon
        icon=${action.icon || "mdi:gesture-tap"}
      ></ha-icon>

      <span>${label}</span>
    </button>
  `;
}

  _renderMainControls() {
    return html`
      <div class="main-controls">
        ${MAIN_CONTROLS.map((key) =>
          this._renderMainControl(key)
        )}
      </div>
    `;
  }

  async _runAction(action, forceConfirmation = false) {
  try {
    this._actionError = "";

    const safeAction = forceConfirmation
      ? {
          ...action,
          confirmation: true,
          confirmation_text:
            action.confirmation_text ||
            "Emergency Stop: immediately stop the printer. Continue?"
        }
      : action;

    await executeAction(
      this.hass,
      safeAction
    );
  } catch (error) {
    console.error(
      "3D Printer Control Card:",
      error
    );

    this._actionError =
      error?.message ||
      this._t("card.messages.action_error");
  }
}

  _renderAction(action) {
    if (!action || action.enabled === false) {
      return nothing;
    }

    const configured = Boolean(
      action.entity ||
      action.service ||
      action.url
    );

    return html`
      <button
        class="printer-button"
        ?disabled=${!configured}
        @click=${() => this._runAction(action)}
      >
        <ha-icon
          icon=${action.icon || "mdi:gesture-tap"}
        ></ha-icon>

        <span>${action.label || "Action"}</span>
      </button>
    `;
  }

  _handleSectionToggle(key, event) {
  this._sectionOpen = {
    ...this._sectionOpen,
    [key]: event.currentTarget.open
  };
}

  _renderSection(key, section, content, icon) {
    if (!section?.enabled) {
      return nothing;
    }

    const title =
      section.title ||
      this._t(`card.sections.${key}`);

    if (section.collapsible) {
      const open =
  this._sectionOpen[key] ??
  !section.collapsed;

      return html`
        <details
          class="section"
          ?open=${open}
          @toggle=${(event) =>
            this._handleSectionToggle(key, event)}
        >
          <summary>
            <span class="section-heading">
              ${icon
                ? html`<ha-icon icon=${icon}></ha-icon>`
                : nothing}

              ${title}
            </span>

            <ha-icon
              class="section-chevron"
              icon="mdi:chevron-down"
            ></ha-icon>
          </summary>

          <div class="section-content">
            ${content}
          </div>
        </details>
      `;
    }

    return html`
      <section class="section">
        <div class="section-heading">
          ${icon
            ? html`<ha-icon icon=${icon}></ha-icon>`
            : nothing}

          ${title}
        </div>

        <div class="section-content">
          ${content}
        </div>
      </section>
    `;
  }

  _renderQuickActions() {
    const actions = this._config.quick_actions || [];

    if (!actions.length) {
      return nothing;
    }

    const content = html`
      <div class="quick-actions">
        ${actions.map((action) =>
          this._renderAction(action)
        )}
      </div>
    `;

    return this._renderSection(
      "quick_actions",
      this._config.sections.quick_actions,
      content,
      "mdi:lightning-bolt"
    );
  }

  _renderStatistics() {
    const section = this._config.sections.statistics;

    if (!section?.enabled) {
      return nothing;
    }

    const statistics = (this._config.statistics || [])
      .filter((item) => item.enabled !== false)
      .slice()
      .sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );

    const content = statistics.length
      ? html`
          <div
            class="statistics-grid"
            style=${`--statistics-columns:${Math.max(
              1,
              Math.min(6, Number(section.columns) || 3)
            )}`}
          >
            ${statistics.map((item) => {
              const value = getEntityValue(
                this.hass,
                item.entity,
                item.attribute || null
              );

              const unit =
                item.unit !== undefined
                  ? item.unit
                  : getEntityUnit(
                      this.hass,
                      item.entity
                    );

              return html`
                <div class="stat-tile ${item.size || ""}">
                  <div class="stat-header">
                    <span class="stat-label">
                      ${item.label ||
                        getEntityName(this.hass, item.entity)}
                    </span>

                    ${item.icon
                      ? html`
                          <ha-icon
                            icon=${item.icon}
                          ></ha-icon>
                        `
                      : nothing}
                  </div>

                  <div class="stat-value">
                    ${value}
                    ${unit
                      ? html`<span>${unit}</span>`
                      : nothing}
                  </div>
                </div>
              `;
            })}
          </div>
        `
      : html`
          <div class="empty-message">
            ${this._t("card.messages.no_statistics")}
          </div>
        `;

    return this._renderSection(
      "statistics",
      section,
      content,
      "mdi:chart-box-outline"
    );
  }

  _cameraUrl(camera) {
  const refreshKey = camera.refresh_interval
    ? String(this._refreshCounter)
    : "";

  if (camera.url) {
    if (!refreshKey) {
      return camera.url;
    }

    const separator = camera.url.includes("?")
      ? "&"
      : "?";

    return `${camera.url}${separator}refresh=${refreshKey}`;
  }

  return getImageUrl(
    this.hass,
    camera.entity,
    refreshKey
  );
}

  _renderCameras() {
    const section = this._config.sections.cameras;

    if (!section?.enabled) {
      return nothing;
    }

    const cameras = (this._config.cameras || [])
      .filter((camera) => camera.enabled !== false);

    const content = cameras.length
      ? html`
          <div
            class="cameras-grid"
            style=${`
              --camera-columns:${Math.max(
                1,
                Math.min(4, Number(section.columns) || 2)
              )};
              --camera-ratio:${
                this._config.appearance.camera_aspect_ratio ||
                "16 / 9"
              };
            `}
          >
            ${cameras.map((camera, index) => {
              const url = this._cameraUrl(camera);

              const cameraName =
                camera.label ||
                camera.name ||
                getEntityName(this.hass, camera.entity);

              return html`
                <div class="camera-tile">
                  ${url
                    ? html`
                        <img
                          class="camera-image"
                          src=${url}
                          alt=${cameraName}
                          loading="lazy"
                          @error=${() => {
                            this._cameraError = {
                              ...this._cameraError,
                              [index]: true
                            };
                          }}
                          @load=${() => {
                            if (this._cameraError[index]) {
                              this._cameraError = {
                                ...this._cameraError,
                                [index]: false
                              };
                            }
                          }}
                        >
                      `
                    : html`
                        <div class="thumbnail-placeholder">
                          <ha-icon icon="mdi:cctv-off"></ha-icon>
                        </div>
                      `}

                  <div class="camera-caption">
                    <span>${cameraName}</span>

                    ${camera.entity
                      ? html`
                          <ha-icon
                            icon="mdi:video-outline"
                            title=${camera.entity}
                          ></ha-icon>
                        `
                      : nothing}
                  </div>

                  ${this._cameraError[index]
                    ? html`
                        <div class="empty-message">
                          ${this._t("card.messages.camera_unavailable")}
                        </div>
                      `
                    : nothing}
                </div>
              `;
            })}
          </div>
        `
      : html`
          <div class="empty-message">
            ${this._t("card.messages.no_cameras")}
          </div>
        `;

    return this._renderSection(
      "cameras",
      section,
      content,
      "mdi:cctv"
    );
  }

  /**
   * Wektorowa grafika śpiącej drukarki.
   */
  _renderSleepingPrinter() {
    const animation =
      this._config.appearance.animation !== false;

    return html`
      <div class="offline-view">
        <svg
          class="sleeping-printer"
          viewBox="0 0 340 245"
          role="img"
          aria-label="Sleeping 3D printer"
        >
          <!-- Cień -->
          <ellipse
            cx="166"
            cy="220"
            rx="110"
            ry="9"
            fill="currentColor"
            opacity="0.10"
          />

          <!-- Obudowa -->
          <rect
            x="69"
            y="53"
            width="193"
            height="154"
            rx="13"
            fill="var(--secondary-background-color)"
            stroke="var(--primary-text-color)"
            stroke-opacity="0.5"
            stroke-width="4"
          />

          <!-- Okno komory -->
          <rect
            x="87"
            y="72"
            width="157"
            height="112"
            rx="5"
            fill="var(--printer-surface)"
            stroke="var(--printer-border)"
            stroke-width="3"
          />

          <!-- Drukowana platforma -->
          <path
            d="M113 159 H218"
            stroke="var(--printer-muted)"
            stroke-width="6"
            stroke-linecap="round"
          />

          <!-- Głowica -->
          <rect
            x="150"
            y="99"
            width="33"
            height="19"
            rx="4"
            fill="var(--printer-accent)"
            opacity="0.85"
          />

          <path
            d="M166 118 V133 L161 140"
            fill="none"
            stroke="var(--printer-accent)"
            stroke-width="4"
            stroke-linecap="round"
          />

          <!-- Nogi -->
          <path
            d="M94 207 V214 M237 207 V214"
            stroke="var(--primary-text-color)"
            stroke-width="5"
            stroke-linecap="round"
          />

          <!-- Panel -->
          <rect
            x="195"
            y="40"
            width="42"
            height="20"
            rx="5"
            fill="var(--secondary-background-color)"
            stroke="var(--printer-muted)"
            stroke-width="2"
          />

          <circle
            cx="216"
            cy="50"
            r="4"
            fill="var(--printer-accent)"
          />

          <!-- Zzz -->
          <g
            fill="var(--printer-accent)"
            font-family="sans-serif"
            font-weight="800"
            class=${animation ? "sleep-z" : ""}
          >
            <text x="260" y="89" font-size="27">Z</text>
            <text x="281" y="62" font-size="21">Z</text>
            <text x="301" y="39" font-size="16">Z</text>
          </g>

          <!-- Drobne detale -->
          <path
            d="M120 184 H214"
            stroke="var(--printer-border)"
            stroke-width="2"
          />
        </svg>

        <div class="offline-title">
          ${this._config.offline_message ||
            this._t("card.offline.title")}
        </div>

        <div class="offline-description">
          ${this._config.offline_subtitle ||
            this._t("card.offline.subtitle")}
        </div>
      </div>
    `;
  }

  render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const offline = this._isOffline();

    return html`
      <ha-card>
        <div class="${this._config.appearance.compact_mode
          ? "compact"
          : ""}">
          <div class="printer-card">
            ${this._renderHeader(offline)}

            ${offline
              ? this._renderSleepingPrinter()
              : html`
                  ${this._renderJob()}

                  ${this._renderMainControls()}

                  ${this._actionError
                    ? html`
                        <div class="action-error" role="alert">
                          ${this._actionError}
                        </div>
                      `
                    : nothing}

                  ${this._renderQuickActions()}

                  ${this._renderStatistics()}

                  ${this._renderCameras()}
                `}
          </div>
        </div>
      </ha-card>
    `;
  }
}

customElements.define(
  "printer-control-card",
  PrinterControlCard
);

window.customCards = window.customCards || [];

window.customCards.push({
  type: "printer-control-card",
  name: "3D Printer Control Card",
  description:
    "Configurable printer dashboard for Moonraker, Klipper and Home Assistant.",
  preview: true,
  documentationURL:
    "https://github.com/YOUR_GITHUB_USERNAME/3d-printer-control-card"
});
