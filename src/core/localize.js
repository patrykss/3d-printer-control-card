
import en from "../translations/en.json";
import pl from "../translations/pl.json";

const TRANSLATIONS = {
  en,
  pl
};

/**
 * Pobiera wartość z obiektu tłumaczeń.
 */
function getNestedValue(object, path) {
  return path
    .split(".")
    .reduce(
      (current, key) => current?.[key],
      object
    );
}

/**
 * Zwraca tłumaczenie dla aktualnego języka HA.
 */
export function localize(hass, key, variables = {}) {
  const language = String(
    hass?.locale?.language || "en"
  ).toLowerCase();

  const dictionary = language.startsWith("pl")
    ? TRANSLATIONS.pl
    : TRANSLATIONS.en;

  let value = getNestedValue(dictionary, key);

  if (typeof value !== "string") {
    value = getNestedValue(TRANSLATIONS.en, key);
  }

  if (typeof value !== "string") {
    return key;
  }

  return value.replace(
    /\{([^}]+)\}/g,
    (match, variable) => {
      return variables[variable] ?? match;
    }
  );
}
