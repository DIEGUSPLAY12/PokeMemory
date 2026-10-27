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
