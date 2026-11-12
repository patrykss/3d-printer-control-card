
/**
 * Pobiera stan encji.
 */
export function getEntityState(hass, entityId) {
  if (!hass || !entityId) {
    return null;
  }

  return hass.states?.[entityId] || null;
}

/**
 * Odczyt wartości encji lub jej atrybutu.
 */
export function getEntityValue(
  hass,
  entityId,
  attribute = null,
  fallback = "—"
) {
  const entity = getEntityState(hass, entityId);

  if (!entity) {
    return fallback;
  }

  if (attribute) {
    return entity.attributes?.[attribute] ?? fallback;
  }

  return entity.state ?? fallback;
}

/**
 * Odczyt wartości liczbowej.
 */
export function getNumericValue(
  hass,
  entityId,
  fallback = 0
) {
  const value = Number(
    getEntityValue(hass, entityId, null, fallback)
  );

  return Number.isFinite(value)
    ? value
    : fallback;
}

/**
 * Sprawdza, czy drukarka jest offline.
 */
export function isPrinterOffline(
  hass,
  connectionEntity,
  offlineStates = []
) {
  if (!connectionEntity) {
    return false;
  }

  const state = getEntityState(
    hass,
    connectionEntity
  );

  if (!state) {
    return true;
  }

  const offline = offlineStates.map((value) =>
    String(value).toLowerCase()
  );

  return offline.includes(
    String(state.state).toLowerCase()
  );
}

/**
 * Formatowanie daty i godziny.
 */
export function formatDateTime(
  value,
  language = "pl-PL"
) {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "unknown" ||
    value === "unavailable"
  ) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(language, {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

/**
 * Formatowanie czasu pozostałego.
 *
 * Przyjmuje sekundy.
 */
export function formatDuration(seconds) {
  const total = Number(seconds);

  if (!Number.isFinite(total) || total < 0) {
    return "—";
  }

  const remaining = Math.floor(total);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor(
    (remaining % 3600) / 60
  );

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }

  return `${minutes} min`;
}

/**
 * Pobiera jednostkę encji.
 */
export function getEntityUnit(hass, entityId) {
  return (
    getEntityState(hass, entityId)
      ?.attributes?.unit_of_measurement || ""
  );
}

/**
 * Zwraca adres obrazu dla encji camera lub image.
 *
 * Korzystamy z mechanizmu proxy Home Assistant,
 * zamiast bezpośrednio łączyć się z kamerą.
 */
export function getImageUrl(
  hass,
  entityId,
  refreshKey = ""
) {
  if (!entityId) {
    return "";
  }

  const entity = getEntityState(
    hass,
    entityId
  );

  if (!entity) {
    return "";
  }

  const domain = entityId.split(".")[0];

  const imagePicture =
    entity.attributes?.entity_picture;

  let url = imagePicture || "";

  if (!url && domain === "camera") {
    url = `/api/camera_proxy/${entityId}`;
  }

  if (!url && domain === "image") {
    url = `/api/image/serve/${entityId}/original`;
  }

  if (!url) {
    return "";
  }

  if (refreshKey) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}refresh=${encodeURIComponent(refreshKey)}`;
  }

  return url;
}

/**
 * Pobiera nazwę przyjazną encji.
 */
export function getEntityName(hass, entityId) {
  const state = getEntityState(hass, entityId);

  return (
    state?.attributes?.friendly_name ||
    entityId ||
    "Nieznana encja"
  );
}

/**
 * Bezpieczne ograniczenie postępu wydruku.
 */
export function normalizeProgress(value) {
  const progress = Number(value);

  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, progress)
  );
}

/**
 * Odczyt języka Home Assistant.
 */
export function getLanguage(hass) {
  return (
    hass?.locale?.language ||
    "pl-PL"
  );
}
