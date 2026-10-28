import { fetchRandomPokemons } from "../services/pokeapi.js";
import { createCards, createGameState, selectCard, resolveMismatch } from "./gameLogic.js";
import { startTimer, stopTimer, formatTime } from "./timer.js";
import { MISMATCH_DELAY_MS } from "../utils/constants.js";
import {
  renderBoard,
  updateBoard,
  clearBoard,
  showMessage,
  showGameFinished,
  hideGameFinished,
  renderTimer,
} from "../ui/gameView.js";

let gameToken = 0;
let pendingTimeoutId = null;
let lastCardCount = null;
let currentGameState = null;
let isRestartBound = false;

function setupRestartButton() {
  if (isRestartBound) {
    return;
  }
  const restartButton = document.getElementById("restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      if (lastCardCount !== null) {
        startGame(lastCardCount);
      }
    });
    isRestartBound = true;
  }
}

/**
 * Inicia una nueva partida con la cantidad de cartas indicada.
 * @param {number} cardCount - Número total de cartas (número par).
 */
export async function startGame(cardCount) {
  setupRestartButton();

  stopTimer();
  renderTimer(formatTime(0));

  gameToken++;
  const currentToken = gameToken;

  if (pendingTimeoutId) {
    clearTimeout(pendingTimeoutId);
    pendingTimeoutId = null;
  }

  hideGameFinished();
  lastCardCount = cardCount;

  showMessage("Cargando...");
  const startBtn = document.getElementById("start-game-btn");
  if (startBtn) {
    startBtn.disabled = true;
  }

  let pokemons;
  try {
    pokemons = await fetchRandomPokemons(cardCount / 2);
  } catch (error) {
    if (currentToken === gameToken) {
      showMessage(error?.message || "Error al cargar los Pokémon. Inténtalo de nuevo.");
      if (startBtn) {
        startBtn.disabled = false;
      }
    }
    return;
  }

  if (currentToken !== gameToken) {
    return;
  }

  if (startBtn) {
    startBtn.disabled = false;
  }
  showMessage("");

  const cards = createCards(pokemons);
  currentGameState = createGameState(cards);

  renderBoard(currentGameState.cards, handleCardClick);

  startTimer((seconds) => {
    renderTimer(formatTime(seconds));
  });

  const restartBtn = document.getElementById("restart-button");
  if (restartBtn) {
    restartBtn.disabled = false;
  }
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

  if (result === "flipped" || result === "match") {
    updateBoard(currentGameState.cards);
    if (currentGameState.isFinished) {
      stopTimer();
      showGameFinished();
    }
  } else if (result === "mismatch") {
    updateBoard(currentGameState.cards);
    pendingTimeoutId = setTimeout(() => {
      pendingTimeoutId = null;
      resolveMismatch(currentGameState);
      updateBoard(currentGameState.cards);
    }, MISMATCH_DELAY_MS);
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

  const startBtn = document.getElementById("start-game-btn");
  if (startBtn) {
    startBtn.disabled = false;
  }
  const restartBtn = document.getElementById("restart-button");
  if (restartBtn) {
    restartBtn.disabled = true;
  }
}
