import { STORAGE_KEYS } from "../utils/constants.js";

// Guarda el perfil del usuario en sessionStorage
export function saveProfile(profile) {
  sessionStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

// Obtiene y valida el perfil del usuario desde sessionStorage
export function getProfile() {
  const datosGuardados = sessionStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!datosGuardados) {
    return null;
  }

  try {
    const perfil = JSON.parse(datosGuardados);
    if (!perfil || typeof perfil !== "object") {
      return null;
    }

    const tieneCamposValidos =
      Boolean(perfil.username) &&
      perfil.pokemonId !== undefined &&
      perfil.pokemonId !== null &&
      Boolean(perfil.pokemonName) &&
      Boolean(perfil.pokemonImage);

    return tieneCamposValidos ? perfil : null;
  } catch {
    return null;
  }
}

// Elimina el perfil del usuario de sessionStorage
export function clearProfile() {
  sessionStorage.removeItem(STORAGE_KEYS.PROFILE);
}
