
export async function executeAction(hass, action) {
  if (!hass) {
    throw new Error("Home Assistant nie jest dostępny.");
  }

  if (!action || action.enabled === false) {
    return false;
  }

  if (action.confirmation) {
    const message =
      action.confirmation_text ||
      "Czy na pewno wykonać tę operację?";

    if (!window.confirm(message)) {
      return false;
    }
  }

  // Otwieranie zewnętrznych paneli.
  if (action.url) {
    const url = String(action.url).trim();

    if (!/^https?:\/\//i.test(url)) {
      throw new Error("Nieprawidłowy adres URL.");
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    return true;
  }

  // Własna usługa HA.
  if (action.service) {
    const parts = String(action.service).split(".");

    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(
        `Nieprawidłowa usługa: ${action.service}`
      );
    }

    const [domain, service] = parts;

    const target = {
      ...(action.entity
        ? { entity_id: action.entity }
        : {}),
      ...(action.target || {})
    };

    const serviceData = {
      ...(action.service_data || {}),
      ...target
    };

    await hass.callService(
      domain,
      service,
      serviceData
    );

    return true;
  }

  // Przycisk Home Assistant.
  if (action.entity) {
    const entityId = String(action.entity);
    const domain = entityId.split(".")[0];

    const serviceMap = {
      button: ["button", "press"],
      input_button: ["input_button", "press"],
      script: ["script", "turn_on"]
    };

    const serviceDefinition = serviceMap[domain];

    if (!serviceDefinition) {
      throw new Error(
        `Encja ${entityId} wymaga jawnego określenia usługi.`
      );
    }

    const [serviceDomain, service] = serviceDefinition;

    await hass.callService(
      serviceDomain,
      service,
      { entity_id: entityId }
    );

    return true;
  }

  throw new Error(
    "Nie skonfigurowano encji, usługi ani adresu URL."
  );
}

export function getDefaultControls() {
  return {
    pause: {
      label: "Pause",
      icon: "mdi:pause",
      confirmation: false,
      enabled: true
    },

    resume: {
      label: "Resume",
      icon: "mdi:play",
      confirmation: false,
      enabled: true
    },

    cancel: {
      label: "Cancel",
      icon: "mdi:stop",
      confirmation: true,
      confirmation_text:
        "Czy na pewno anulować aktualny wydruk?",
      enabled: true
    },

    emergency_stop: {
      label: "Emergency Stop",
      icon: "mdi:alert-octagon",
      confirmation: true,
      confirmation_text:
        "UWAGA! To zatrzymanie awaryjne. Drukarka zostanie natychmiast zatrzymana. Kontynuować?",
      enabled: true
    }
  };
}
