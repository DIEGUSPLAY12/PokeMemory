import { validateCardCount } from "../utils/validators.js";

let currentCardClickHandler = null;
let isBoardListenerAttached = false;

/**
 * Rellena la cabecera de la sección de juego con los datos del perfil del jugador.
 * @param {Object} profile - Perfil del jugador ({ username, pokemonId, pokemonName, pokemonImage }).
 */
export function renderPlayerHeader(profile) {
  if (!profile) {
    return;
  }

  const usernameElement = document.getElementById("player-username");
  const pokemonImageElement = document.getElementById("player-pokemon-image");
  const pokemonNameElement = document.getElementById("player-pokemon-name");

  if (usernameElement) {
    usernameElement.textContent = profile.username || "";
  }

  if (pokemonImageElement) {
    pokemonImageElement.src = profile.pokemonImage || "";
    pokemonImageElement.alt = profile.pokemonName || "Pokémon favorito";
  }

  if (pokemonNameElement) {
    pokemonNameElement.textContent = profile.pokemonName || "";
  }
}

/**
 * Inicializa la configuración de la partida vinculando el formulario de selección de cartas.
 * @param {Function} onStartGame - Callback invocado con el número de cartas validado (number).
 */
export function initGameSetup(onStartGame) {
  const form = document.getElementById("game-setup-form");
  if (!form) {
    return;
  }

  const cardCountInput = document.getElementById("card-count-input");
  const cardCountError = document.getElementById("card-count-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const rawValue = cardCountInput ? cardCountInput.value : "";
    const errorMessage = validateCardCount(rawValue);

    if (errorMessage) {
      if (cardCountError) {
        cardCountError.textContent = errorMessage;
      }
      return;
    }

    if (cardCountError) {
      cardCountError.textContent = "";
    }

    const cardCount = Number(rawValue.trim());
    if (typeof onStartGame === "function") {
      onStartGame(cardCount);
    }
  });
}

/**
 * Pinta el tablero de cartas en el contenedor #board usando delegación de eventos.
 * @param {Array} cards - Lista de cartas del juego.
 * @param {Function} onCardClick - Callback ejecutado con el índice de la carta al hacer clic.
 */
export function renderBoard(cards = [], onCardClick) {
  const boardElement = document.getElementById("board");
  if (!boardElement) {
    return;
  }

  currentCardClickHandler = onCardClick;

  if (!isBoardListenerAttached) {
    boardElement.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-index]");
      if (button && boardElement.contains(button) && typeof currentCardClickHandler === "function") {
        const index = parseInt(button.dataset.index, 10);
        if (!Number.isNaN(index)) {
          currentCardClickHandler(index);
        }
      }
    });
    isBoardListenerAttached = true;
  }

  boardElement.innerHTML = "";

  cards.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.index = String(index);
    button.setAttribute("aria-label", `Carta ${index + 1}`);

    if (card.isFlipped) {
      button.classList.add("card--flipped");
    }
    if (card.isMatched) {
      button.classList.add("card--matched");
    }

    const backSpan = document.createElement("span");
    backSpan.className = "card-back";
    backSpan.textContent = "Pokéball";

    const frontImg = document.createElement("img");
    frontImg.className = "card-front";
    frontImg.src = card.image || "";
    frontImg.alt = card.name || "Pokémon";

    button.appendChild(backSpan);
    button.appendChild(frontImg);

    boardElement.appendChild(button);
  });
}

/**
 * Refresca las clases CSS card--flipped y card--matched de cada carta según el estado actual.
 * @param {Array} cards - Lista de cartas del juego.
 */
export function updateBoard(cards = []) {
  const boardElement = document.getElementById("board");
  if (!boardElement || !Array.isArray(cards)) {
    return;
  }

  const buttons = boardElement.querySelectorAll("button[data-index]");
  buttons.forEach((button) => {
    const index = parseInt(button.dataset.index, 10);
    const card = cards[index];
    if (card) {
      button.classList.toggle("card--flipped", Boolean(card.isFlipped));
      button.classList.toggle("card--matched", Boolean(card.isMatched));
    }
  });
}

/**
 * Vacía el contenedor del tablero.
 */
export function clearBoard() {
  const boardElement = document.getElementById("board");
  if (boardElement) {
    boardElement.innerHTML = "";
  }
}

/**
 * Muestra un texto en el elemento de estado del juego.
 * @param {string} text
 */
export function showMessage(text = "") {
  const statusElement = document.getElementById("game-status");
  if (statusElement) {
    statusElement.textContent = text;
  }
}

/**
 * Muestra el mensaje de fin de partida.
 */
export function showGameFinished() {
  const finishedElement = document.getElementById("game-finished");
  if (finishedElement) {
    finishedElement.hidden = false;
  }
}

/**
 * Oculta el mensaje de fin de partida.
 */
export function hideGameFinished() {
  const finishedElement = document.getElementById("game-finished");
  if (finishedElement) {
    finishedElement.hidden = true;
  }
}

/**
 * Renderiza el tiempo formateado en el elemento #timer.
 * @param {string} text
 */
export function renderTimer(text = "") {
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.textContent = text;
  }
}

/**
 * Habilita o deshabilita el botón de empezar partida.
 * @param {boolean} disabled
 */
export function setStartButtonDisabled(disabled) {
  const startButton = document.getElementById("start-game-btn");
  if (startButton) {
    startButton.disabled = disabled;
  }
}

/**
 * Habilita o deshabilita el botón de reiniciar partida.
 * @param {boolean} disabled
 */
export function setRestartButtonDisabled(disabled) {
  const restartButton = document.getElementById("restart-button");
  if (restartButton) {
    restartButton.disabled = disabled;
  }
}

/**
 * Vincula el manejador de clic del botón de reinicio de partida.
 * @param {Function} onRestart
 */
export function initRestartButton(onRestart) {
  const restartButton = document.getElementById("restart-button");
  if (restartButton && typeof onRestart === "function") {
    restartButton.addEventListener("click", onRestart);
  }
}
