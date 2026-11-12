
import { LitElement, html, css, nothing } from "lit";

import { normalizeConfig } from "../core/config.js";

import {
  discoverPrinterEntities,
  discoverTemperatureEntities
} from "../core/discovery.js";

import { localize } from "../core/localize.js";

export class PrinterControlCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _message: { state: true }
  };

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
    }

    .editor {
      display: flex;
      flex-direction: column;
      gap: 17px;
      padding: 12px 0;
    }

    .editor-title {
      font-size: 1.1rem;
      font-weight: 650;
      margin: 0 0 3px;
    }

    .editor-section {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
    }

    .section-header {
      padding: 13px 15px;
      font-weight: 650;
      background: var(--secondary-background-color);
    }

    .section-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .field-label {
      color: var(--secondary-text-color);
      font-size: 0.82rem;
      font-weight: 550;
    }

    input,
    select,
    textarea {
      box-sizing: border-box;
      min-height: 40px;
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.9rem;
    }

    textarea {
      resize: vertical;
      min-height: 70px;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
      --mdc-menu-max-height: 350px;
    }

    .field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 11px;
    }

    .item {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 11px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      font-weight: 650;
    }

    .item-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    button {
      font: inherit;
      cursor: pointer;
    }

    .add-button {
      min-height: 40px;
      width: 100%;
      border: 1px dashed var(--primary-color);
      border-radius: 9px;
      background: transparent;
      color: var(--primary-color);
      font-weight: 600;
    }

    .remove-button {
      border: none;
      background: transparent;
      color: var(--error-color);
      font-size: 0.82rem;
      padding: 5px;
    }

    .detect-button {
      min-height: 43px;
      border: 1px solid var(--primary-color);
      border-radius: 9px;
      color: var(--primary-color);
      background: transparent;
      font-weight: 600;
    }

    .message {
      padding: 10px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: 0.88rem;
    }

    .checkbox input {
      width: 18px;
      height: 18px;
      min-height: auto;
      accent-color: var(--primary-color);
    }

    @media (max-width: 450px) {
      .field-grid,
      .item-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  constructor() {
    super();

    this.hass = undefined;
    this._config = undefined;
    this._message = "";
  }

  setConfig(config) {
    this._config = normalizeConfig(config || {});
  }

  _t(key, variables = {}) {
    return localize(this.hass, key, variables);
  }

  /**
   * Zapisuje nową konfigurację i informuje HA.
   */
  _commit(nextConfig) {
    this._config = nextConfig;

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: {
          config: nextConfig
        }
      })
    );
  }

  _updateTop(key, value) {
    const next = {
      ...this._config,
      [key]: value
    };

    this._commit(next);
  }

  _updateEntity(key, value) {
    const next = {
      ...this._config,
      entities: {
        ...this._config.entities,
        [key]: value
      }
    };

    this._commit(next);
  }

  _updateControl(key, property, value) {
    const next = {
      ...this._config,
      controls: {
        ...this._config.controls,
        [key]: {
          ...this._config.controls[key],
          [property]: value
        }
      }
    };

    this._commit(next);
  }

  _updateSection(key, property, value) {
    const next = {
      ...this._config,
      sections: {
        ...this._config.sections,
        [key]: {
          ...this._config.sections[key],
          [property]: value
        }
      }
    };

    this._commit(next);
  }

  _updateAppearance(key, value) {
    const next = {
      ...this._config,
      appearance: {
        ...this._config.appearance,
        [key]: value
      }
    };

    this._commit(next);
  }

  _updateArrayItem(arrayName, index, property, value) {
    const items = [
      ...this._config[arrayName]
    ];

    items[index] = {
      ...items[index],
      [property]: value
    };

    this._updateTop(arrayName, items);
  }

  _removeArrayItem(arrayName, index) {
    const items = [
      ...this._config[arrayName]
    ];

    items.splice(index, 1);

    this._updateTop(arrayName, items);
  }

  _addArrayItem(arrayName, item) {
    this._updateTop(arrayName, [
      ...(this._config[arrayName] || []),
      item
    ]);
  }

  _textField(label, value, onChange, placeholder = "") {
    return html`
      <label class="field">
        <span class="field-label">${label}</span>

        <input
          .value=${String(value ?? "")}
          placeholder=${placeholder}
          @change=${(event) =>
            onChange(event.target.value)}
        >
      </label>
    `;
  }

  _numberField(label, value, onChange, min = 0, max = 100) {
    return html`
      <label class="field">
        <span class="field-label">${label}</span>

        <input
          type="number"
          min=${min}
          max=${max}
          .value=${String(value ?? "")}
          @change=${(event) =>
            onChange(Number(event.target.value))}
        >
      </label>
    `;
  }

  _entityField(label, value, onChange) {
    return html`
      <label class="field">
        <span class="field-label">${label}</span>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${value || ""}
          allow-custom-entity
          @value-changed=${(event) =>
            onChange(event.detail.value)}
        ></ha-entity-picker>
      </label>
    `;
  }

  _selectField(label, value, options, onChange) {
    return html`
      <label class="field">
        <span class="field-label">${label}</span>

        <select
          .value=${String(value ?? "")}
          @change=${(event) =>
            onChange(event.target.value)}
        >
          ${options.map((option) => html`
            <option
              value=${option.value}
              ?selected=${String(value) === String(option.value)}
            >
              ${option.label}
            </option>
          `)}
        </select>
      </label>
    `;
  }

  _checkField(label, value, onChange) {
    return html`
      <label class="checkbox">
        <input
          type="checkbox"
          .checked=${Boolean(value)}
          @change=${(event) =>
            onChange(event.target.checked)}
        >

        <span>${label}</span>
      </label>
    `;
  }

  _section(title, content) {
    return html`
      <section class="editor-section">
        <div class="section-header">
          ${title}
        </div>

        <div class="section-body">
          ${content}
        </div>
      </section>
    `;
  }

  /**
   * Podstawowe ustawienia i identyfikacja drukarki.
   */
  _renderGeneral() {
    return this._section(
      this._t("card.editor.general"),
      html`
        ${this._textField(
          this._t("card.editor.printer_name"),
          this._config.name,
          (value) =>
            this._updateTop("name", value)
        )}

        ${this._entityField(
          this._t("card.editor.connection_entity"),
          this._config.connection_entity,
          (value) =>
            this._updateTop("connection_entity", value)
        )}

        ${this._textField(
          "Filtr wykrywania drukarki",
          this._config.printer_hint || "",
          (value) =>
            this._updateTop("printer_hint", value),
          "np. voron, ender, bambu"
        )}

        <div class="field">
          <span class="field-label">
            Stany oznaczające tryb offline
          </span>

          ${this._textField(
            "Lista stanów oddzielonych przecinkami",
            this._config.offline_states.join(", "),
            (value) =>
              this._updateTop(
                "offline_states",
                value.split(",")
                  .map((item) => item.trim().toLowerCase())
                  .filter(Boolean)
              )
          )}
        </div>

        ${this._textField(
          "Komunikat offline",
          this._config.offline_message,
          (value) =>
            this._updateTop("offline_message", value)
        )}

        ${this._textField(
          "Opis trybu offline",
          this._config.offline_subtitle,
          (value) =>
            this._updateTop("offline_subtitle", value)
        )}

        <button
          class="detect-button"
          @click=${this._detectEntities}
        >
          ${this._t("card.editor.detect_button")}
        </button>

        ${this._message
          ? html`<div class="message">${this._message}</div>`
          : nothing}
      `
    );
  }

  /**
   * Automatyczne wykrywanie encji.
   *
   * Nie nadpisujemy pól, które użytkownik już skonfigurował.
   */
  _detectEntities() {
    if (!this.hass) {
      return;
    }

    const found = discoverPrinterEntities(
      this.hass,
      this._config.printer_hint || ""
    );

    const next = {
      ...this._config,
      entities: {
        ...this._config.entities
      },
      controls: {
        ...this._config.controls
      }
    };

    const mapping = {
      status: "status",
      filename: "filename",
      progress: "progress",
      started_at: "started_at",
      estimated_end: "estimated_end",
      remaining_time: "remaining_time",
      thumbnail: "thumbnail"
    };

    let count = 0;

    if (
      !next.connection_entity &&
      found.entities.connection_entity
    ) {
      next.connection_entity =
        found.entities.connection_entity;
      count++;
    }

    for (const [source, target] of Object.entries(mapping)) {
      if (
        !next.entities[target] &&
        found.entities[source]
      ) {
        next.entities[target] =
          found.entities[source];
        count++;
      }
    }

    for (const control of [
      "pause",
      "resume",
      "cancel",
      "emergency_stop"
    ]) {
      const candidate =
        found.controls[control]?.[0];

      if (
        candidate &&
        !next.controls[control]?.entity &&
        !next.controls[control]?.service
      ) {
        next.controls[control] = {
          ...next.controls[control],
          entity: candidate.entity_id
        };

        count++;
      }
    }

    this._commit(next);

    this._message = count > 0
      ? `Wykrywanie zakończone. Uzupełniono ${count} pól. Sprawdź przypisane encje.`
      : this._t("card.editor.not_detected");
  }

  /**
   * Konfiguracja encji odpowiedzialnych za wydruk.
   */
  _renderJobSettings() {
    const fields = [
      ["status", "Status drukarki"],
      ["filename", "Nazwa aktualnego pliku"],
      ["progress", "Postęp wydruku (%)"],
      ["started_at", "Czas rozpoczęcia"],
      ["estimated_end", "Przewidywany czas zakończenia"],
      ["remaining_time", "Pozostały czas (sekundy)"],
      ["thumbnail", "Miniatura wydruku"]
    ];

    return this._section(
      this._t("card.editor.job_settings"),
      html`
        ${fields.map(([key, label]) =>
          this._entityField(
            label,
            this._config.entities[key],
            (value) =>
              this._updateEntity(key, value)
          )
        )}
      `
    );
  }

  /**
   * Konfiguracja przycisków głównych.
   */
  _renderControls() {
    return this._section(
      this._t("card.editor.controls"),
      html`
        ${[
          "pause",
          "resume",
          "cancel",
          "emergency_stop"
        ].map((key) => {
          const action = this._config.controls[key];

          return html`
            <div class="item">
              <div class="item-header">
                <span>${action.label || key}</span>

                ${key === "emergency_stop"
                  ? html`<span style="color:var(--error-color)">STOP</span>`
                  : nothing}
              </div>

              ${this._textField(
                "Nazwa przycisku",
                action.label,
                (value) =>
                  this._updateControl(key, "label", value)
              )}

              ${this._textField(
                "Ikona MDI",
                action.icon,
                (value) =>
                  this._updateControl(key, "icon", value),
                "mdi:pause"
              )}

              ${this._entityField(
                "Encja sterująca",
                action.entity,
                (value) =>
                  this._updateControl(key, "entity", value)
              )}

              ${this._textField(
                "Usługa HA (domain.service)",
                action.service,
                (value) =>
                  this._updateControl(key, "service", value),
                "np. button.press"
              )}

              ${this._checkField(
                "Wymagaj potwierdzenia",
                action.confirmation,
                (value) =>
                  this._updateControl(key, "confirmation", value)
              )}

              ${action.confirmation
                ? this._textField(
                    "Treść komunikatu potwierdzenia",
                    action.confirmation_text,
                    (value) =>
                      this._updateControl(
                        key,
                        "confirmation_text",
                        value
                      )
                  )
                : nothing}

              ${this._checkField(
                "Aktywny",
                action.enabled !== false,
                (value) =>
                  this._updateControl(key, "enabled", value)
              )}
            </div>
          `;
        })}
      `
    );
  }

  /**
   * Konfiguracja dowolnych akcji.
   */
  _renderQuickActions() {
    const actions = this._config.quick_actions || [];

    return this._section(
      this._t("card.editor.quick_actions"),
      html`
        ${actions.map((action, index) => html`
          <div class="item">
            <div class="item-header">
              <span>
                ${action.label || `Przycisk ${index + 1}`}
              </span>

              <button
                class="remove-button"
                @click=${() =>
                  this._removeArrayItem("quick_actions", index)}
              >
                Usuń
              </button>
            </div>

            ${this._textField(
              "Nazwa przycisku",
              action.label,
              (value) =>
                this._updateArrayItem(
                  "quick_actions",
                  index,
                  "label",
                  value
                )
            )}

            ${this._textField(
              "Ikona MDI",
              action.icon,
              (value) =>
                this._updateArrayItem(
                  "quick_actions",
                  index,
                  "icon",
                  value
                ),
              "mdi:home"
            )}

            ${this._entityField(
              "Encja",
              action.entity,
              (value) =>
                this._updateArrayItem(
                  "quick_actions",
                  index,
                  "entity",
                  value
                )
            )}

            ${this._textField(
              "Usługa",
              action.service,
              (value) =>
                this._updateArrayItem(
                  "quick_actions",
                  index,
                  "service",
                  value
                ),
              "button.press"
            )}

            ${this._textField(
              "Adres URL",
              action.url,
              (value) =>
                this._updateArrayItem(
                  "quick_actions",
                  index,
                  "url",
                  value
                ),
              "https://fluidd.local"
            )}

            ${this._checkField(
              "Wymagaj potwierdzenia",
              action.confirmation,
              (value) =>
                this._updateArrayItem(
                  "quick_actions",
                  index,
                  "confirmation",
                  value
                )
            )}

            ${this._checkField(
              "Aktywny",
              action.enabled !== false,
              (value) =>
                this._updateArrayItem(
                  "quick_actions",
                  index,
                  "enabled",
                  value
                )
            )}
          </div>
        `)}

        <button
          class="add-button"
          @click=${() =>
            this._addArrayItem("quick_actions", {
              label: "Nowa akcja",
              icon: "mdi:gesture-tap",
              entity: "",
              service: "",
              url: "",
              confirmation: false,
              enabled: true
            })}
        >
          + Dodaj własny przycisk
        </button>
      `
    );
  }

  /**
   * Statystyki i temperatury.
   */
  _renderStatistics() {
    const items = this._config.statistics || [];

    const temperatureEntities =
      discoverTemperatureEntities(this.hass);

    return this._section(
      this._t("card.editor.statistics"),
      html`
        <div class="message">
          Możesz dodawać temperatury dyszy, stołu,
          komory, suszarki, elektroniki oraz dowolne
          inne encje Home Assistant.
        </div>

        ${temperatureEntities.length
          ? html`
              <div class="message">
                Wykryto ${temperatureEntities.length}
                encji związanych z temperaturą.
              </div>
            `
          : nothing}

        ${items.map((item, index) => html`
          <div class="item">
            <div class="item-header">
              <span>${item.label || `Statystyka ${index + 1}`}</span>

              <button
                class="remove-button"
                @click=${() =>
                  this._removeArrayItem("statistics", index)}
              >
                Usuń
              </button>
            </div>

            ${this._textField(
              "Nazwa kafelka",
              item.label,
              (value) =>
                this._updateArrayItem(
                  "statistics",
                  index,
                  "label",
                  value
                )
            )}

            ${this._entityField(
              "Encja",
              item.entity,
              (value) =>
                this._updateArrayItem(
                  "statistics",
                  index,
                  "entity",
                  value
                )
            )}

            <div class="item-grid">
              ${this._textField(
                "Atrybut",
                item.attribute,
                (value) =>
                  this._updateArrayItem(
                    "statistics",
                    index,
                    "attribute",
                    value
                  )
              )}

              ${this._textField(
                "Jednostka",
                item.unit,
                (value) =>
                  this._updateArrayItem(
                    "statistics",
                    index,
                    "unit",
                    value
                  ),
                "Automatyczna, jeśli puste"
              )}

              ${this._textField(
                "Ikona MDI",
                item.icon,
                (value) =>
                  this._updateArrayItem(
                    "statistics",
                    index,
                    "icon",
                    value
                  )
              )}

              ${this._selectField(
                "Rozmiar kafelka",
                item.size || "small",
                [
                  { value: "small", label: "Mały" },
                  { value: "large", label: "Duży" },
                  { value: "full", label: "Pełna szerokość" }
                ],
                (value) =>
                  this._updateArrayItem(
                    "statistics",
                    index,
                    "size",
                    value
                  )
              )}

              ${this._numberField(
                "Kolejność",
                item.order || 0,
                (value) =>
                  this._updateArrayItem(
                    "statistics",
                    index,
                    "order",
                    value
                  ),
                0,
                999
              )}
            </div>

            ${this._checkField(
              "Widoczny",
              item.enabled !== false,
              (value) =>
                this._updateArrayItem(
                  "statistics",
                  index,
                  "enabled",
                  value
                )
            )}
          </div>
        `)}

        <button
          class="add-button"
          @click=${() =>
            this._addArrayItem("statistics", {
              label: "Nowa statystyka",
              entity: "",
              attribute: "",
              unit: "",
              icon: "mdi:thermometer",
              size: "small",
              order: items.length,
              enabled: true
            })}
        >
          + Dodaj statystykę
        </button>
      `
    );
  }

  /**
   * Kamery Moonraker, Tapo, LSC i inne encje HA.
   */
  _renderCameras() {
    const cameras = this._config.cameras || [];

    return this._section(
      this._t("card.editor.cameras"),
      html`
        <div class="message">
          Obsługiwane są encje camera i image
          Home Assistant oraz bezpośrednie adresy URL
          obrazów.
        </div>

        ${cameras.map((camera, index) => html`
          <div class="item">
            <div class="item-header">
              <span>
                ${camera.label || `Kamera ${index + 1}`}
              </span>

              <button
                class="remove-button"
                @click=${() =>
                  this._removeArrayItem("cameras", index)}
              >
                Usuń
              </button>
            </div>

            ${this._textField(
              "Nazwa kamery",
              camera.label,
              (value) =>
                this._updateArrayItem(
                  "cameras",
                  index,
                  "label",
                  value
                )
            )}

            ${this._entityField(
              "Encja kamery",
              camera.entity,
              (value) =>
                this._updateArrayItem(
                  "cameras",
                  index,
                  "entity",
                  value
                )
            )}

            ${this._textField(
              "Adres URL obrazu",
              camera.url,
              (value) =>
                this._updateArrayItem(
                  "cameras",
                  index,
                  "url",
                  value
                ),
              "Opcjonalnie: https://..."
            )}

            ${this._numberField(
              "Odświeżanie obrazu (sekundy)",
              camera.refresh_interval || 0,
              (value) =>
                this._updateArrayItem(
                  "cameras",
                  index,
                  "refresh_interval",
                  value
                ),
              0,
              3600
            )}

            ${this._checkField(
              "Aktywna kamera",
              camera.enabled !== false,
              (value) =>
                this._updateArrayItem(
                  "cameras",
                  index,
                  "enabled",
                  value
                )
            )}
          </div>
        `)}

        <button
          class="add-button"
          @click=${() =>
            this._addArrayItem("cameras", {
              label: "Nowa kamera",
              entity: "",
              url: "",
              refresh_interval: 0,
              enabled: true
            })}
        >
          + Dodaj kamerę
        </button>
      `
    );
  }

  /**
   * Wygląd, sekcje oraz responsywność.
   */
  _renderAppearance() {
    const sections = this._config.sections;
    const appearance = this._config.appearance;

    return this._section(
      this._t("card.editor.appearance"),
      html`
        <h4>Szybkie akcje</h4>

        ${this._sectionSettings("quick_actions")}

        <h4>Statystyki</h4>

        ${this._sectionSettings("statistics")}

        <h4>Kamery</h4>

        ${this._sectionSettings("cameras")}

        <div class="field-grid">
          ${this._numberField(
            "Kolumny statystyk",
            sections.statistics.columns,
            (value) =>
              this._updateSection("statistics", "columns", value),
            1,
            6
          )}

          ${this._numberField(
            "Kolumny kamer",
            sections.cameras.columns,
            (value) =>
              this._updateSection("cameras", "columns", value),
            1,
            4
          )}
        </div>

        ${this._selectField(
          "Proporcje obrazu kamer",
          appearance.camera_aspect_ratio,
          [
            { value: "16 / 9", label: "16:9" },
            { value: "4 / 3", label: "4:3" },
            { value: "1 / 1", label: "1:1" },
            { value: "9 / 16", label: "9:16" }
          ],
          (value) =>
            this._updateAppearance(
              "camera_aspect_ratio",
              value
            )
        )}

        ${this._checkField(
          "Tryb kompaktowy",
          appearance.compact_mode,
          (value) =>
            this._updateAppearance("compact_mode", value)
        )}

        ${this._checkField(
          "Pokazuj status",
          appearance.show_status,
          (value) =>
            this._updateAppearance("show_status", value)
        )}

        ${this._checkField(
          "Pokazuj pasek postępu",
          appearance.show_progress,
          (value) =>
            this._updateAppearance("show_progress", value)
        )}

        ${this._checkField(
          "Pokazuj czasy wydruku",
          appearance.show_times,
          (value) =>
            this._updateAppearance("show_times", value)
        )}

        ${this._checkField(
          "Pokazuj miniaturę",
          appearance.show_thumbnails,
          (value) =>
            this._updateAppearance("show_thumbnails", value)
        )}

        ${this._checkField(
          "Animacja trybu offline",
          appearance.animation,
          (value) =>
            this._updateAppearance("animation", value)
        )}
      `
    );
  }

  _sectionSettings(key) {
    const section = this._config.sections[key];

    return html`
      ${this._textField(
        "Tytuł sekcji",
        section.title,
        (value) =>
          this._updateSection(key, "title", value)
      )}

      ${this._checkField(
        "Pokaż sekcję",
        section.enabled,
        (value) =>
          this._updateSection(key, "enabled", value)
      )}

      ${this._checkField(
        "Możliwość zwijania",
        section.collapsible,
        (value) =>
          this._updateSection(key, "collapsible", value)
      )}

      ${section.collapsible
        ? this._checkField(
            "Domyślnie zwinięta",
            section.collapsed,
            (value) =>
              this._updateSection(key, "collapsed", value)
          )
        : nothing}
    `;
  }

  render() {
    if (!this._config) {
      return nothing;
    }

    return html`
      <div class="editor">
        <h3 class="editor-title">
          ${this._t("card.editor.title")}
        </h3>

        ${this._renderGeneral()}

        ${this._renderJobSettings()}

        ${this._renderControls()}

        ${this._renderQuickActions()}

        ${this._renderStatistics()}

        ${this._renderCameras()}

        ${this._renderAppearance()}
      </div>
    `;
  }
}

customElements.define(
  "printer-control-card-editor",
  PrinterControlCardEditor
);
