import { fetchRandomPokemons } from "../services/pokeapi.js";
import { createCards, createGameState, selectCard, resolveMismatch } from "./gameLogic.js";
import { startTimer, stopTimer, formatTime, getElapsedSeconds } from "./timer.js";
import { getProfile } from "../storage/sessionStore.js";
import { addResult } from "../storage/historyStore.js";
import { MISMATCH_DELAY_MS } from "../utils/constants.js";
import {
  renderBoard,
  updateBoard,
  clearBoard,
  showMessage,
  showGameFinished,
  hideGameFinished,
  renderTimer,
  setStartButtonDisabled,
  setRestartButtonDisabled,
  initRestartButton,
} from "../ui/gameView.js";
import { renderRanking } from "../ui/rankingView.js";

export let lastResultId = null;

let gameToken = 0;
let pendingTimeoutId = null;
let lastCardCount = null;
let currentGameState = null;
let isRestartInitialized = false;

function ensureRestartHandler() {
  if (isRestartInitialized) {
    return;
  }
  initRestartButton(() => {
    if (lastCardCount !== null) {
      startGame(lastCardCount);
    }
  });
  isRestartInitialized = true;
}

/**
 * Guarda el resultado de la partida en el historial y actualiza el ranking.
 */
function handleGameFinished() {
  stopTimer();
  showGameFinished();

  if (!currentGameState.resultSaved) {
    currentGameState.resultSaved = true;
    const profile = getProfile();
    const savedResult = addResult({
      username: profile?.username || "",
      favoritePokemon: {
        id: profile?.pokemonId,
        name: profile?.pokemonName,
        image: profile?.pokemonImage,
      },
      timeSeconds: getElapsedSeconds(),
      cards: currentGameState.cards.length,
    });
    lastResultId = savedResult?.id || null;
    renderRanking(lastResultId);
  }
}

/**
 * Programa la vuelta a estado oculto tras un fallo de coincidencia.
 */
function handleMismatch() {
  updateBoard(currentGameState.cards);
  pendingTimeoutId = setTimeout(() => {
    pendingTimeoutId = null;
    resolveMismatch(currentGameState);
    updateBoard(currentGameState.cards);
  }, MISMATCH_DELAY_MS);
}

/**
 * Inicia una nueva partida con la cantidad de cartas indicada.
 * @param {number} cardCount - Número total de cartas (número par).
 */
export async function startGame(cardCount) {
  ensureRestartHandler();

  stopTimer();
  renderTimer(formatTime(0));
  renderRanking();

  gameToken++;
  const currentToken = gameToken;

  if (pendingTimeoutId) {
    clearTimeout(pendingTimeoutId);
    pendingTimeoutId = null;
  }

  hideGameFinished();
  lastCardCount = cardCount;

  showMessage("Cargando...");
  setStartButtonDisabled(true);

  let pokemons;
  try {
    pokemons = await fetchRandomPokemons(cardCount / 2);
  } catch (error) {
    if (currentToken === gameToken) {
      showMessage(error?.message || "Error al cargar los Pokémon. Inténtalo de nuevo.");
      setStartButtonDisabled(false);
    }
    return;
  }

  if (currentToken !== gameToken) {
    return;
  }

  setStartButtonDisabled(false);
  showMessage("");

  const cards = createCards(pokemons);
  currentGameState = createGameState(cards);

  renderBoard(currentGameState.cards, handleCardClick);

  startTimer((seconds) => {
    renderTimer(formatTime(seconds));
  });

  setRestartButtonDisabled(false);
}

/**
 * Manejador del clic en una carta de la partida en curso.
 * @param {number} index - Índice de la carta seleccionada.
 */
function handleCardClick(index) {
  if (!currentGameState) {
    return;
  }

  const result = selectCard(currentGameState, index);

  if (result === "ignored") {
    return;
  }

  if (result === "flipped") {
    updateBoard(currentGameState.cards);
    return;
  }

  if (result === "match") {
    updateBoard(currentGameState.cards);
    if (currentGameState.isFinished) {
      handleGameFinished();
    }
    return;
  }

  if (result === "mismatch") {
    handleMismatch();
  }
}

/**
 * Cancela la partida en curso, limpia timeouts y vacía el tablero.
 */
export function cancelGame() {
  gameToken++;
  if (pendingTimeoutId) {
    clearTimeout(pendingTimeoutId);
    pendingTimeoutId = null;
  }

  stopTimer();
  renderTimer(formatTime(0));

  currentGameState = null;
  clearBoard();
  showMessage("");
  hideGameFinished();

  setStartButtonDisabled(false);
  setRestartButtonDisabled(true);
}

