/**
 * Genera la baraja duplicando cada Pokémon en dos cartas y barajándolas con Fisher-Yates.
 * @param {Array<{ id: number, name: string, image: string }>} pokemons
 * @returns {Array<{ uid: string, pokemonId: number, name: string, image: string, isFlipped: boolean, isMatched: boolean }>}
 */
export function createCards(pokemons = []) {
  const cards = [];

  for (const pokemon of pokemons) {
    cards.push({
      uid: `${pokemon.id}-1`,
      pokemonId: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      uid: `${pokemon.id}-2`,
      pokemonId: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      isFlipped: false,
      isMatched: false,
    });
  }

  // Algoritmo de barajado Fisher-Yates
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

/**
 * Crea el estado inicial del juego a partir de la baraja de cartas.
 * @param {Array} cards
 * @returns {{ cards: Array, selectedIndexes: Array<number>, isChecking: boolean, isFinished: boolean }}
 */
export function createGameState(cards = []) {
  return {
    cards,
    selectedIndexes: [],
    isChecking: false,
    isFinished: false,
  };
}

/**
 * Aplica la lógica de selección de una carta según las reglas de Memory.
 * @param {Object} state - Estado del juego.
 * @param {number} index - Índice de la carta seleccionada.
 * @returns {"ignored" | "flipped" | "match" | "mismatch"}
 */
export function selectCard(state, index) {
  if (!state || !Array.isArray(state.cards)) {
    return "ignored";
  }

  if (state.isFinished || state.isChecking) {
    return "ignored";
  }

  if (index < 0 || index >= state.cards.length) {
    return "ignored";
  }

  const card = state.cards[index];
  if (!card || card.isFlipped || card.isMatched) {
    return "ignored";
  }

  // Primera carta seleccionada
  if (state.selectedIndexes.length === 0) {
    card.isFlipped = true;
    state.selectedIndexes.push(index);
    return "flipped";
  }

  // Segunda carta seleccionada
  if (state.selectedIndexes.length === 1) {
    card.isFlipped = true;
    const firstIndex = state.selectedIndexes[0];
    const firstCard = state.cards[firstIndex];

    if (firstCard.pokemonId === card.pokemonId) {
      firstCard.isMatched = true;
      card.isMatched = true;
      state.selectedIndexes = [];

      const allMatched = state.cards.every((item) => item.isMatched);
      if (allMatched) {
        state.isFinished = true;
      }

      return "match";
    }

    state.selectedIndexes.push(index);
    state.isChecking = true;
    return "mismatch";
  }

  return "ignored";
}

/**
 * Oculta las dos cartas que no coincidieron, limpia la selección y desactiva el bloqueo de comprobación.
 * @param {Object} state - Estado del juego.
 */
export function resolveMismatch(state) {
  if (!state || !Array.isArray(state.selectedIndexes)) {
    return;
  }

  for (const index of state.selectedIndexes) {
    if (state.cards[index]) {
      state.cards[index].isFlipped = false;
    }
  }

  state.selectedIndexes = [];
  state.isChecking = false;
}
