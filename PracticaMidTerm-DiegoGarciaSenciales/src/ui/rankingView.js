import { getHistory } from "../storage/historyStore.js";
import { formatTime } from "../game/timer.js";
import { RANKING_VISIBLE_ROWS } from "../utils/constants.js";

let currentVisibleLimit = RANKING_VISIBLE_ROWS;
let currentHighlightedId = null;
let areControlsInitialized = false;

/**
 * Ordena los resultados del historial: primero más cartas (descendente)
 * y a igualdad de cartas, menor tiempo transcurrido (ascendente).
 * @param {Array} results
 * @returns {Array} Nueva copia ordenada de los resultados.
 */
export function sortResults(results = []) {
  return [...results].sort((a, b) => {
    if (b.cards !== a.cards) {
      return b.cards - a.cards;
    }
    return a.timeSeconds - b.timeSeconds;
  });
}

/**
 * Determina las filas visibles del ranking incluyendo posibles filas omitidas ("...").
 * @param {Array} sortedResults - Lista ordenada de resultados.
 * @param {string|null} highlightedId - ID del resultado a destacar.
 * @param {number} visibleLimit - Cantidad de mejores resultados a mostrar inicialmente.
 * @returns {Array<{ type: "result", position: number, result: Object } | { type: "omitted" }>}
 */
export function getVisibleRows(
  sortedResults = [],
  highlightedId = null,
  visibleLimit = RANKING_VISIBLE_ROWS
) {
  const total = sortedResults.length;
  const effectiveLimit = Math.max(0, visibleLimit);

  if (total <= effectiveLimit) {
    return sortedResults.map((result, index) => ({
      type: "result",
      position: index + 1,
      result,
    }));
  }

  const indicesSet = new Set();
  for (let i = 0; i < effectiveLimit && i < total; i++) {
    indicesSet.add(i);
  }

  if (highlightedId) {
    const highlightedIndex = sortedResults.findIndex((result) => result.id === highlightedId);
    if (highlightedIndex !== -1) {
      indicesSet.add(highlightedIndex);
    }
  }

  const visibleIndices = Array.from(indicesSet).sort((a, b) => a - b);
  const rows = [];
  let lastIndex = -1;

  for (const idx of visibleIndices) {
    if (idx > lastIndex + 1) {
      rows.push({ type: "omitted" });
    }
    rows.push({
      type: "result",
      position: idx + 1,
      result: sortedResults[idx],
    });
    lastIndex = idx;
  }

  return rows;
}

/**
 * Crea la cabecera estándar de la tabla de ranking.
 * @returns {HTMLTableSectionElement}
 */
function createTableHeader() {
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["Posición", "Jugador", "Pokémon", "Tiempo", "Cartas"];
  for (const title of headers) {
    const headerCell = document.createElement("th");
    headerCell.textContent = title;
    headerRow.appendChild(headerCell);
  }
  thead.appendChild(headerRow);
  return thead;
}

/**
 * Inicializa los eventos de la barra de controles de filtrado y ordenación.
 */
function initRankingControls() {
  if (areControlsInitialized) {
    return;
  }

  const playerInput = document.getElementById("ranking-filter-player");
  const cardsSelect = document.getElementById("ranking-filter-cards");
  const timeSelect = document.getElementById("ranking-sort-time");
  const clearBtn = document.getElementById("ranking-clear-filters-btn");

  if (!playerInput || !cardsSelect || !timeSelect || !clearBtn) {
    return;
  }

  playerInput.addEventListener("input", () => {
    currentVisibleLimit = RANKING_VISIBLE_ROWS;
    renderRanking(currentHighlightedId, false);
  });

  cardsSelect.addEventListener("change", () => {
    currentVisibleLimit = RANKING_VISIBLE_ROWS;
    renderRanking(currentHighlightedId, false);
  });

  timeSelect.addEventListener("change", () => {
    currentVisibleLimit = RANKING_VISIBLE_ROWS;
    renderRanking(currentHighlightedId, false);
  });

  clearBtn.addEventListener("click", () => {
    playerInput.value = "";
    cardsSelect.value = "all";
    timeSelect.value = "asc";
    currentVisibleLimit = RANKING_VISIBLE_ROWS;
    renderRanking(currentHighlightedId, false);
  });

  areControlsInitialized = true;
}

/**
 * Actualiza dinámicamente las opciones del selector de cartas según el historial cargado.
 * @param {Array} history
 */
function updateCardFilterOptions(history = []) {
  const cardsSelect = document.getElementById("ranking-filter-cards");
  if (!cardsSelect) {
    return;
  }

  const uniqueCardCounts = Array.from(
    new Set(
      history
        .map((result) => result.cards)
        .filter((count) => typeof count === "number" && count > 0)
    )
  ).sort((a, b) => a - b);

  const existingValues = Array.from(cardsSelect.options).map((option) => option.value);
  const newValues = ["all", ...uniqueCardCounts.map(String)];

  const isIdentical =
    existingValues.length === newValues.length &&
    existingValues.every((val, idx) => val === newValues[idx]);

  if (isIdentical) {
    return;
  }

  const selectedValue = cardsSelect.value || "all";
  cardsSelect.innerHTML = '<option value="all">Todas</option>';
  for (const count of uniqueCardCounts) {
    const option = document.createElement("option");
    option.value = String(count);
    option.textContent = String(count);
    cardsSelect.appendChild(option);
  }

  if (uniqueCardCounts.map(String).includes(selectedValue)) {
    cardsSelect.value = selectedValue;
  } else {
    cardsSelect.value = "all";
  }
}

/**
 * Renderiza la sección del ranking en el contenedor #ranking-container.
 * @param {string|null} highlightedId - ID de la fila a destacar con estilo especial.
 * @param {boolean} shouldResetLimit - Si debe reiniciar el límite de filas a 5.
 */
export function renderRanking(highlightedId = null, shouldResetLimit = true) {
  if (shouldResetLimit) {
    currentVisibleLimit = RANKING_VISIBLE_ROWS;
  }
  currentHighlightedId = highlightedId;

  initRankingControls();

  const container =
    document.getElementById("ranking-container") || document.getElementById("ranking-section");
  if (!container) {
    return;
  }

  const history = getHistory();
  container.innerHTML = "";

  if (!history || history.length === 0) {
    updateCardFilterOptions([]);
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Aún no hay partidas jugadas";
    container.appendChild(emptyMessage);
    return;
  }

  updateCardFilterOptions(history);

  const playerInput = document.getElementById("ranking-filter-player");
  const cardsSelect = document.getElementById("ranking-filter-cards");
  const timeSelect = document.getElementById("ranking-sort-time");

  const playerQuery = playerInput ? playerInput.value.trim().toLowerCase() : "";
  const selectedCards = cardsSelect ? cardsSelect.value : "all";
  const timeSortOrder = timeSelect ? timeSelect.value : "asc";

  // 1. Filtrado combinado sobre todos los resultados cargados
  let filteredResults = history.filter((item) => {
    if (playerQuery.length > 0) {
      const username = (item.username || "").toLowerCase();
      if (!username.includes(playerQuery)) {
        return false;
      }
    }

    if (selectedCards !== "all" && selectedCards !== "") {
      const cardTarget = Number(selectedCards);
      if (!Number.isNaN(cardTarget) && item.cards !== cardTarget) {
        return false;
      }
    }

    return true;
  });

  // 2. Orden elegido por tiempo
  filteredResults.sort((a, b) => {
    if (a.timeSeconds !== b.timeSeconds) {
      return timeSortOrder === "desc"
        ? b.timeSeconds - a.timeSeconds
        : a.timeSeconds - b.timeSeconds;
    }
    return b.cards - a.cards;
  });

  const table = document.createElement("table");
  table.className = "ranking-table";
  table.appendChild(createTableHeader());

  const tbody = document.createElement("tbody");

  // Si no hay coincidencias tras filtrar
  if (filteredResults.length === 0) {
    const noMatchesRow = document.createElement("tr");
    noMatchesRow.className = "ranking__row--no-matches";
    const noMatchesCell = document.createElement("td");
    noMatchesCell.colSpan = 5;
    noMatchesCell.textContent = "No hay partidas que coincidan";
    noMatchesRow.appendChild(noMatchesCell);
    tbody.appendChild(noMatchesRow);
    table.appendChild(tbody);
    container.appendChild(table);
    return;
  }

  // 3. Obtener filas visibles recalculando la posición
  const visibleRows = getVisibleRows(filteredResults, currentHighlightedId, currentVisibleLimit);

  for (const row of visibleRows) {
    const rowElement = document.createElement("tr");

    if (row.type === "omitted") {
      rowElement.className = "ranking__row--omitted";
      const omittedCell = document.createElement("td");
      omittedCell.colSpan = 5;
      omittedCell.textContent = "...";
      rowElement.appendChild(omittedCell);
    } else {
      if (row.result.id === currentHighlightedId) {
        rowElement.className = "ranking__row--highlight";
      }

      // 1. Posición recalculada según el orden mostrado
      const positionCell = document.createElement("td");
      positionCell.textContent = String(row.position);
      rowElement.appendChild(positionCell);

      // 2. Jugador
      const playerCell = document.createElement("td");
      playerCell.textContent = row.result.username || "";
      rowElement.appendChild(playerCell);

      // 3. Pokémon (imagen pequeña + nombre)
      const pokemonCell = document.createElement("td");
      if (row.result.favoritePokemon?.image) {
        const img = document.createElement("img");
        img.className = "ranking__pokemon-img";
        img.src = row.result.favoritePokemon.image;
        img.alt = row.result.favoritePokemon.name || "Pokémon";
        pokemonCell.appendChild(img);
      }
      const pokeName = document.createElement("span");
      pokeName.textContent = row.result.favoritePokemon?.name || "";
      pokemonCell.appendChild(pokeName);
      rowElement.appendChild(pokemonCell);

      // 4. Tiempo
      const timeCell = document.createElement("td");
      timeCell.textContent = formatTime(row.result.timeSeconds);
      rowElement.appendChild(timeCell);

      // 5. Cartas
      const cardsCell = document.createElement("td");
      cardsCell.textContent = String(row.result.cards);
      rowElement.appendChild(cardsCell);
    }

    tbody.appendChild(rowElement);
  }

  table.appendChild(tbody);
  container.appendChild(table);

  // Botón "Ver más": muestra 5 partidas más y se oculta cuando no quedan más resultados
  const loadMoreButton = document.createElement("button");
  loadMoreButton.type = "button";
  loadMoreButton.id = "ranking-load-more-btn";
  loadMoreButton.className = "ranking__load-more-btn";
  loadMoreButton.textContent = "Ver más";
  loadMoreButton.hidden = filteredResults.length <= currentVisibleLimit;

  loadMoreButton.addEventListener("click", () => {
    currentVisibleLimit += RANKING_VISIBLE_ROWS;
    renderRanking(currentHighlightedId, false);
  });

  container.appendChild(loadMoreButton);
}


