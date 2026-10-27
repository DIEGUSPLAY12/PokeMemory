import { validateCardCount } from "../utils/validators.js";

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
