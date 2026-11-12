
const FIELD_RULES = {
  connection_entity: {
    domains: ["binary_sensor", "sensor"],
    patterns: [
      /moonraker.*connected/i,
      /printer.*connected/i,
      /printer.*online/i,
      /connection.*status/i,
      /klipper.*connected/i
    ]
  },

  status: {
    domains: ["sensor"],
    patterns: [
      /print.*state/i,
      /printer.*state/i,
      /klipper.*state/i,
      /print.*status/i
    ]
  },

  filename: {
    domains: ["sensor"],
    patterns: [
      /current.*print/i,
      /current.*file/i,
      /filename/i,
      /print.*filename/i,
      /job.*name/i
    ]
  },

  progress: {
    domains: ["sensor"],
    patterns: [
      /print.*progress/i,
      /progress.*print/i,
      /print.*percentage/i,
      /completion/i
    ]
  },

  started_at: {
    domains: ["sensor"],
    patterns: [
      /print.*start.*time/i,
      /start.*time/i,
      /print.*started/i
    ]
  },

  estimated_end: {
    domains: ["sensor"],
    patterns: [
      /estimated.*end/i,
      /estimated.*finish/i,
      /print.*end.*time/i,
      /print.*finish.*time/i
    ]
  },

  remaining_time: {
    domains: ["sensor"],
    patterns: [
      /print.*remaining.*time/i,
      /remaining.*time/i,
      /time.*remaining/i
    ]
  },

  thumbnail: {
    domains: ["camera", "image", "sensor"],
    patterns: [
      /thumbnail/i,
      /print.*preview/i,
      /current.*print.*image/i,
      /gcode.*image/i
    ]
  }
};

const CONTROL_RULES = {
  pause: [
    /pause.*print/i,
    /print.*pause/i
  ],

  resume: [
    /resume.*print/i,
    /print.*resume/i
  ],

  cancel: [
    /cancel.*print/i,
    /print.*cancel/i
  ],

  emergency_stop: [
    /emergency.*stop/i,
    /stop.*emergency/i
  ]
};

function getSearchText(entityId, state) {
  const friendlyName = state?.attributes?.friendly_name || "";

  return `${entityId} ${friendlyName}`.toLowerCase();
}

function entityDomain(entityId) {
  return entityId.split(".")[0];
}

function scoreEntity(entityId, state, rules, printerHint = "") {
  const domain = entityDomain(entityId);

  if (!rules.domains.includes(domain)) {
    return 0;
  }

  const searchText = getSearchText(entityId, state);

  let score = 0;

  for (const pattern of rules.patterns) {
    if (pattern.test(searchText)) {
      score += 10;
    }
  }

  if (
    printerHint &&
    searchText.includes(printerHint.toLowerCase())
  ) {
    score += 15;
  }

  if (state?.state === "unavailable") {
    score -= 2;
  }

  return score;
}

function getCandidates(hass, rules, printerHint = "") {
  const results = [];

  for (const [entityId, state] of Object.entries(hass.states || {})) {
    const score = scoreEntity(
      entityId,
      state,
      rules,
      printerHint
    );

    if (score > 0) {
      results.push({
        entity_id: entityId,
        name:
          state.attributes?.friendly_name ||
          entityId,
        domain: entityDomain(entityId),
        score
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Wykrywanie encji drukarki.
 *
 * Zwraca najlepszą sugestię oraz pełną listę
 * kandydatów dla każdego pola.
 */
export function discoverPrinterEntities(
  hass,
  printerHint = ""
) {
  const result = {
    entities: {},
    candidates: {},
    controls: {},
    cameras: [],
    printer_hint: printerHint
  };

  for (const [field, rules] of Object.entries(FIELD_RULES)) {
    const candidates = getCandidates(
      hass,
      rules,
      printerHint
    );

    result.candidates[field] = candidates;

    result.entities[field] =
      candidates[0]?.entity_id || "";
  }

  for (const [control, patterns] of Object.entries(CONTROL_RULES)) {
    const matches = [];

    for (const [entityId, state] of Object.entries(hass.states || {})) {
      if (!["button", "script", "input_button"].includes(entityDomain(entityId))) {
        continue;
      }

      const searchText = getSearchText(entityId, state);

      const matched = patterns.some((pattern) =>
        pattern.test(searchText)
      );

      if (matched) {
        matches.push({
          entity_id: entityId,
          name:
            state.attributes?.friendly_name ||
            entityId
        });
      }
    }

    result.controls[control] = matches;
  }

  result.cameras = Object.entries(hass.states || {})
    .filter(([entityId]) => entityDomain(entityId) === "camera")
    .map(([entityId, state]) => ({
      entity_id: entityId,
      name:
        state.attributes?.friendly_name ||
        entityId
    }));

  return result;
}

/**
 * Wykrywa encje temperatur.
 */
export function discoverTemperatureEntities(hass) {
  return Object.entries(hass.states || {})
    .filter(([entityId, state]) => {
      const unit = state.attributes?.unit_of_measurement;

      const text = getSearchText(entityId, state);

      return (
        entityDomain(entityId) === "sensor" &&
        (
          unit === "°C" ||
          unit === "°F" ||
          /temperature|temperatura|temp/i.test(text)
        )
      );
    })
    .map(([entityId, state]) => ({
      entity_id: entityId,
      name:
        state.attributes?.friendly_name ||
        entityId,
      unit:
        state.attributes?.unit_of_measurement || "",
      value: state.state
    }));
}
