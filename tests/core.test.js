
import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeConfig,
  validateConfig
} from "../src/core/config.js";

import {
  discoverPrinterEntities,
  discoverTemperatureEntities
} from "../src/core/discovery.js";

import {
  normalizeProgress,
  formatDuration,
  isPrinterOffline,
  getEntityValue
} from "../src/core/utils.js";

test("creates default printer configuration", () => {
  const config = normalizeConfig({
    name: "Voron"
  });

  assert.equal(config.name, "Voron");
  assert.equal(config.controls.pause.icon, "mdi:pause");
  assert.equal(config.sections.statistics.enabled, true);
  assert.deepEqual(config.statistics, []);
});

test("preserves custom sections", () => {
  const config = normalizeConfig({
    name: "Ender",
    sections: {
      statistics: {
        columns: 4
      }
    }
  });

  assert.equal(
    config.sections.statistics.columns,
    4
  );

  assert.equal(
    config.sections.cameras.enabled,
    true
  );
});

test("validates printer name", () => {
  assert.throws(
    () => validateConfig({}),
    /Nazwa drukarki/
  );

  assert.equal(
    validateConfig({ name: "Voron" }),
    true
  );
});

test("normalizes print progress", () => {
  assert.equal(normalizeProgress(55), 55);
  assert.equal(normalizeProgress(150), 100);
  assert.equal(normalizeProgress(-10), 0);
  assert.equal(normalizeProgress("invalid"), 0);
});

test("formats duration in hours and minutes", () => {
  assert.equal(
    formatDuration(3660),
    "1 h 1 min"
  );

  assert.equal(
    formatDuration(1800),
    "30 min"
  );

  assert.equal(
    formatDuration(-1),
    "—"
  );
});

test("detects offline printer state", () => {
  const hass = {
    states: {
      "binary_sensor.printer_connected": {
        state: "off",
        attributes: {}
      }
    }
  };

  assert.equal(
    isPrinterOffline(
      hass,
      "binary_sensor.printer_connected",
      ["off", "unavailable"]
    ),
    true
  );

  assert.equal(
    isPrinterOffline(
      hass,
      "",
      ["off"]
    ),
    false
  );
});

test("reads state and attributes", () => {
  const hass = {
    states: {
      "sensor.nozzle_temp": {
        state: "215",
        attributes: {
          unit_of_measurement: "°C"
        }
      }
    }
  };

  assert.equal(
    getEntityValue(
      hass,
      "sensor.nozzle_temp"
    ),
    "215"
  );

  assert.equal(
    getEntityValue(
      hass,
      "sensor.nozzle_temp",
      "unit_of_measurement"
    ),
    "°C"
  );
});

test("discovers printer control entities", () => {
  const hass = {
    states: {
      "binary_sensor.voron_moonraker_connected": {
        state: "on",
        attributes: {
          friendly_name: "Voron connected"
        }
      },

      "sensor.voron_print_progress": {
        state: "50",
        attributes: {
          friendly_name: "Voron print progress"
        }
      },

      "button.voron_pause_print": {
        state: "unknown",
        attributes: {
          friendly_name: "Voron pause print"
        }
      },

      "button.voron_emergency_stop": {
        state: "unknown",
        attributes: {
          friendly_name: "Voron emergency stop"
        }
      },

      "sensor.voron_extruder_temperature": {
        state: "215",
        attributes: {
          friendly_name: "Voron extruder temperature",
          unit_of_measurement: "°C"
        }
      }
    }
  };

  const result = discoverPrinterEntities(
    hass,
    "voron"
  );

  assert.equal(
    result.entities.connection_entity,
    "binary_sensor.voron_moonraker_connected"
  );

  assert.equal(
    result.entities.progress,
    "sensor.voron_print_progress"
  );

  assert.equal(
    result.controls.pause[0].entity_id,
    "button.voron_pause_print"
  );

  assert.equal(
    result.controls.emergency_stop[0].entity_id,
    "button.voron_emergency_stop"
  );
});

test("discovers temperature sensors", () => {
  const hass = {
    states: {
      "sensor.nozzle_temperature": {
        state: "215",
        attributes: {
          friendly_name: "Nozzle",
          unit_of_measurement: "°C"
        }
      },

      "sensor.humidity": {
        state: "40",
        attributes: {
          unit_of_measurement: "%"
        }
      }
    }
  };

  const result = discoverTemperatureEntities(hass);

  assert.equal(result.length, 1);
  assert.equal(
    result[0].entity_id,
    "sensor.nozzle_temperature"
  );
});
