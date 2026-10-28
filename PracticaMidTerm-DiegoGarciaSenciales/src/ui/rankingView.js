import { getHistory } from "../storage/historyStore.js";
import { formatTime } from "../game/timer.js";
import { RANKING_VISIBLE_ROWS } from "../utils/constants.js";

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
 * @returns {Array<{ type: "result", position: number, result: Object } | { type: "omitted" }>}
 */
export function getVisibleRows(sortedResults = [], highlightedId = null) {
  const total = sortedResults.length;
  if (total <= RANKING_VISIBLE_ROWS) {
    return sortedResults.map((result, index) => ({
      type: "result",
      position: index + 1,
      result,
    }));
  }

  const indicesSet = new Set();
  for (let i = 0; i < RANKING_VISIBLE_ROWS; i++) {
    indicesSet.add(i);
  }

  if (highlightedId) {
    const highlightedIndex = sortedResults.findIndex((r) => r.id === highlightedId);
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

  if (lastIndex < total - 1) {
    rows.push({ type: "omitted" });
  }

  return rows;
}

/**
 * Renderiza la sección del ranking en el contenedor #ranking-container.
 * @param {string|null} highlightedId - ID de la fila a destacar con estilo especial.
 */
export function renderRanking(highlightedId = null) {
  const container =
    document.getElementById("ranking-container") || document.getElementById("ranking-section");
  if (!container) {
    return;
  }

  const history = getHistory();
  container.innerHTML = "";

  if (!history || history.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Aún no hay partidas jugadas";
    container.appendChild(emptyMessage);
    return;
  }

  const sortedResults = sortResults(history);
  const visibleRows = getVisibleRows(sortedResults, highlightedId);

  const table = document.createElement("table");
  table.className = "ranking-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = ["Posición", "Jugador", "Pokémon", "Tiempo", "Cartas"];
  for (const title of headers) {
    const th = document.createElement("th");
    th.textContent = title;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  for (const row of visibleRows) {
    const tr = document.createElement("tr");

    if (row.type === "omitted") {
      tr.className = "ranking__row--omitted";
      const td = document.createElement("td");
      td.colSpan = headers.length;
      td.textContent = "...";
      tr.appendChild(td);
    } else {
      if (row.result.id === highlightedId) {
        tr.className = "ranking__row--highlight";
      }

      // 1. Posición
      const posTd = document.createElement("td");
      posTd.textContent = String(row.position);
      tr.appendChild(posTd);

      // 2. Jugador
      const userTd = document.createElement("td");
      userTd.textContent = row.result.username || "";
      tr.appendChild(userTd);

      // 3. Pokémon (imagen pequeña + nombre)
      const pokeTd = document.createElement("td");
      if (row.result.favoritePokemon?.image) {
        const img = document.createElement("img");
        img.className = "ranking__pokemon-img";
        img.src = row.result.favoritePokemon.image;
        img.alt = row.result.favoritePokemon.name || "Pokémon";
        pokeTd.appendChild(img);
      }
      const pokeName = document.createElement("span");
      pokeName.textContent = row.result.favoritePokemon?.name || "";
      pokeTd.appendChild(pokeName);
      tr.appendChild(pokeTd);

      // 4. Tiempo
      const timeTd = document.createElement("td");
      timeTd.textContent = formatTime(row.result.timeSeconds);
      tr.appendChild(timeTd);

      // 5. Cartas
      const cardsTd = document.createElement("td");
      cardsTd.textContent = String(row.result.cards);
      tr.appendChild(cardsTd);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  container.appendChild(table);
}
