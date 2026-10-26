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
