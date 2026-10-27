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

/**
 * Valida la cantidad de cartas para la partida.
 * @param {string} value - Cadena de texto del input de número de cartas.
 * @returns {string|null} Mensaje de error en español o null si es válido.
 */
export function validateCardCount(value) {
  if (typeof value !== "string") {
    return "El número de cartas no puede estar vacío.";
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return "El número de cartas no puede estar vacío.";
  }

  const numberValue = Number(trimmedValue);

  if (Number.isNaN(numberValue)) {
    return "El número de cartas debe ser un número.";
  }

  if (!Number.isInteger(numberValue)) {
    return "El número de cartas debe ser un número entero.";
  }

  if (numberValue <= 0) {
    return "El número de cartas debe ser un número positivo mayor que cero.";
  }

  if (numberValue % 2 !== 0) {
    return "El número de cartas debe ser un número par.";
  }

  return null;
}
