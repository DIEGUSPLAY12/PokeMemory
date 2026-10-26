import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from "./constants.js";

/**
 * Valida el nombre de usuario del jugador.
 * @param {string} value - Cadena de texto a validar.
 * @returns {string|null} Mensaje de error en español o null si es válido.
 */
export function validateUsername(value) {
  if (typeof value !== "string") {
    return "El nombre de usuario no puede estar vacío.";
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return "El nombre de usuario no puede estar vacío.";
  }

  if (trimmedValue.length < USERNAME_MIN_LENGTH) {
    return `El nombre de usuario debe tener al menos ${USERNAME_MIN_LENGTH} caracteres.`;
  }

  if (trimmedValue.length > USERNAME_MAX_LENGTH) {
    return `El nombre de usuario no puede tener más de ${USERNAME_MAX_LENGTH} caracteres.`;
  }

  return null;
}
