// URL base para consultar los recursos de Pokémon en PokeAPI
export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Claves para el almacenamiento en sesion y local
export const STORAGE_KEYS = {
  PROFILE: "pokememory-profile",
  HISTORY: "pokememory-history",
};

// Límites de longitud para el nombre de usuario
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

// Parámetros de búsqueda de Pokémon
export const SEARCH_MAX_RESULTS = 8;
export const SEARCH_DEBOUNCE_MS = 300;

// Retardo para voltear cartas que no coinciden en el juego (ms)
export const MISMATCH_DELAY_MS = 1000;

// Cantidad máxima de filas visibles por defecto en el ranking
export const RANKING_VISIBLE_ROWS = 5;

// Límite de Pokémon a solicitar para la lista de nombres
export const POKEAPI_NAMES_LIMIT = 100000;

// Intervalo de refresco y conversión de milisegundos del temporizador
export const TIMER_INTERVAL_MS = 1000;

// Placeholder SVG en formato data URI para imágenes vacías
export const EMPTY_IMAGE_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
