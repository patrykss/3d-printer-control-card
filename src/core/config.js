
export const CARD_VERSION = "0.2.0";

export const CARD_TYPE = "printer-control-card";

export const DEFAULT_CONFIG = {
  name: "3D Printer",

  printer_hint: "",

  connection_entity: "",

  offline_states: [
    "off",
    "unavailable",
    "unknown",
    "false",
    "0",
    "disconnected",
    "offline"
  ],

  offline_message: "",
  offline_subtitle: "",

  entities: {
    status: "",
    filename: "",
    progress: "",
    started_at: "",
    estimated_end: "",
    remaining_time: "",
    thumbnail: ""
  },

  controls: {
    pause: {
      label: "",
      icon: "mdi:pause",
      entity: "",
      service: "",
      confirmation: false,
      enabled: true
    },

    resume: {
      label: "",
      icon: "mdi:play",
      entity: "",
      service: "",
      confirmation: false,
      enabled: true
    },

    cancel: {
      label: "",
      icon: "mdi:stop",
      entity: "",
      service: "",
      confirmation: true,
      confirmation_text:
        "Czy na pewno anulować wydruk?",
      enabled: true
    },

    emergency_stop: {
      label: "",
      icon: "mdi:alert-octagon",
      entity: "",
      service: "",
      confirmation: true,
      confirmation_text:
        "UWAGA! Zatrzymanie awaryjne natychmiast zatrzyma drukarkę. Kontynuować?",
      enabled: true
    }
  },

  quick_actions: [],

  statistics: [],

  cameras: [],

  sections: {
    quick_actions: {
      title: "",
      enabled: true,
      collapsible: false,
      collapsed: false
    },

    statistics: {
      title: "",
      enabled: true,
      collapsible: true,
      collapsed: false,
      columns: 3
    },

    cameras: {
      title: "",
      enabled: true,
      collapsible: true,
      collapsed: false,
      columns: 2
    }
  },

  appearance: {
    compact_mode: false,
    show_status: true,
    show_progress: true,
    show_times: true,
    show_thumbnails: true,
    camera_aspect_ratio: "16 / 9",
    animation: true
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepMerge(base, override) {
  const result = { ...base };

  for (const [key, value] of Object.entries(override || {})) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(base[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export function normalizeConfig(userConfig = {}) {
  const defaults = clone(DEFAULT_CONFIG);

  const config = deepMerge(
    defaults,
    userConfig
  );

  config.offline_states =
    Array.isArray(config.offline_states)
      ? config.offline_states.map((state) =>
          String(state).toLowerCase()
        )
      : defaults.offline_states;

  config.quick_actions =
    Array.isArray(config.quick_actions)
      ? config.quick_actions
      : [];

  config.statistics =
    Array.isArray(config.statistics)
      ? config.statistics
      : [];

  config.cameras =
    Array.isArray(config.cameras)
      ? config.cameras
      : [];

  return config;
}

export function validateConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error(
      "Nieprawidłowa konfiguracja karty."
    );
  }

  if (!config.name || !String(config.name).trim()) {
    throw new Error(
      "Nazwa drukarki jest wymagana."
    );
  }

  return true;
}
