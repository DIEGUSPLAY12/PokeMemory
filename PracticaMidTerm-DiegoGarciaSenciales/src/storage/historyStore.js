import { STORAGE_KEYS } from "../utils/constants.js";

// Obtiene el historial de resultados desde localStorage
export function getHistory() {
  const datosGuardados = localStorage.getItem(STORAGE_KEYS.HISTORY);
  if (!datosGuardados) {
    return [];
  }

  try {
    const historial = JSON.parse(datosGuardados);
    return Array.isArray(historial) ? historial : [];
  } catch {
    return [];
  }
}

// Genera un identificador unico y anade un nuevo resultado al historial
export function addResult({ username, favoritePokemon, timeSeconds, cards }) {
  const nuevoResultado = {
    id: crypto.randomUUID(),
    username,
    favoritePokemon,
    timeSeconds,
    cards,
  };

  const historial = getHistory();
  historial.push(nuevoResultado);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historial));

  return nuevoResultado;
}
