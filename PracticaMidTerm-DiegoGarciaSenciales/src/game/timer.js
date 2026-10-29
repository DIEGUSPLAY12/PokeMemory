import { TIMER_INTERVAL_MS } from "../utils/constants.js";

let intervalId = null;
let startTime = null;
let elapsedSeconds = 0;

/**
 * Inicia el temporizador de la partida ejecutando un callback cada segundo.
 * @param {Function} onTick - Callback que recibe los segundos transcurridos.
 */
export function startTimer(onTick) {
  stopTimer();

  elapsedSeconds = 0;
  startTime = Date.now();

  if (typeof onTick === "function") {
    onTick(0);
  }

  intervalId = setInterval(() => {
    elapsedSeconds = Math.floor((Date.now() - startTime) / TIMER_INTERVAL_MS);
    if (typeof onTick === "function") {
      onTick(elapsedSeconds);
    }
  }, TIMER_INTERVAL_MS);
}

/**
 * Detiene el temporizador activo guardando el cómputo final de segundos.
 */
export function stopTimer() {
  if (intervalId !== null) {
    if (startTime !== null) {
      elapsedSeconds = Math.floor((Date.now() - startTime) / TIMER_INTERVAL_MS);
    }
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Obtiene los segundos transcurridos guardados del temporizador.
 * @returns {number}
 */
export function getElapsedSeconds() {
  return elapsedSeconds;
}

/**
 * Formatea los segundos totales en una cadena con formato "Xm Ys".
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}m ${seconds}s`;
}
