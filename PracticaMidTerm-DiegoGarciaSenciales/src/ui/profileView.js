import { fetchPokemonNames, fetchPokemonDetail } from "../services/pokeapi.js";
import { validateUsername } from "../utils/validators.js";
import {
  SEARCH_MAX_RESULTS,
  SEARCH_DEBOUNCE_MS,
  EMPTY_IMAGE_DATA_URI,
} from "../utils/constants.js";

let selectedPokemon = null;
let debounceTimeoutId = null;

/**
 * Restablece los campos de texto, la lista de coincidencias, la vista previa,
 * los mensajes de error y olvida el Pokémon elegido en la vista de perfil.
 */
export function resetProfileView() {
  selectedPokemon = null;

  if (debounceTimeoutId) {
    clearTimeout(debounceTimeoutId);
    debounceTimeoutId = null;
  }

  const usernameInput = document.getElementById("username-input");
  if (usernameInput) {
    usernameInput.value = "";
  }

  const pokemonSearchInput = document.getElementById("pokemon-search-input");
  if (pokemonSearchInput) {
    pokemonSearchInput.value = "";
  }

  const pokemonMatchesList = document.getElementById("pokemon-matches-list");
  if (pokemonMatchesList) {
    pokemonMatchesList.innerHTML = "";
  }

  const pokemonPreviewImage = document.getElementById("pokemon-preview-image");
  if (pokemonPreviewImage) {
    pokemonPreviewImage.src = EMPTY_IMAGE_DATA_URI;
    pokemonPreviewImage.alt = "Vista previa del Pokémon seleccionado";
  }

  const pokemonPreviewName = document.getElementById("pokemon-preview-name");
  if (pokemonPreviewName) {
    pokemonPreviewName.textContent = "";
  }

  const usernameError = document.getElementById("username-error");
  if (usernameError) {
    usernameError.textContent = "";
  }

  const pokemonError = document.getElementById("pokemon-error");
  if (pokemonError) {
    pokemonError.textContent = "";
  }

  const generalError = document.getElementById("profile-general-error");
  if (generalError) {
    generalError.textContent = "";
  }
}

/**
 * Inicializa la vista del formulario de perfil de jugador.
 * @param {Function} onProfileCreated - Callback invocado con los datos del perfil al crearse exitosamente.
 */
export async function initProfileView(onProfileCreated) {
  const profileForm = document.getElementById("profile-form");
  if (!profileForm) {
    return;
  }

  const usernameInput = document.getElementById("username-input");
  const usernameError = document.getElementById("username-error");
  const pokemonSearchInput = document.getElementById("pokemon-search-input");
  const pokemonMatchesList = document.getElementById("pokemon-matches-list");
  const pokemonPreviewImage = document.getElementById("pokemon-preview-image");
  const pokemonPreviewName = document.getElementById("pokemon-preview-name");
  const pokemonError = document.getElementById("pokemon-error");
  const generalError = document.getElementById("profile-general-error");

  let pokemonNames = [];

  function showGeneralError(message) {
    if (generalError) {
      generalError.textContent = message;
    }
  }

  function clearGeneralError() {
    if (generalError) {
      generalError.textContent = "";
    }
  }

  function showPokemonError(message) {
    if (pokemonError) {
      pokemonError.textContent = message;
    }
  }

  function clearPokemonError() {
    if (pokemonError) {
      pokemonError.textContent = "";
    }
  }

  function clearMatchesList() {
    if (pokemonMatchesList) {
      pokemonMatchesList.innerHTML = "";
    }
  }

  // 1. Cargar la lista completa de nombres al iniciar
  try {
    clearGeneralError();
    pokemonNames = await fetchPokemonNames();
  } catch (error) {
    showGeneralError(
      error?.message || "Error al cargar la lista de Pokémon. Por favor, recarga la página."
    );
  }

  // 2. Manejo de selección de un Pokémon
  async function handleSelectPokemon(name) {
    clearPokemonError();
    if (pokemonPreviewName) {
      pokemonPreviewName.textContent = "Cargando...";
    }

    try {
      const detail = await fetchPokemonDetail(name);
      selectedPokemon = detail;

      if (pokemonPreviewImage) {
        pokemonPreviewImage.src = detail.image || "";
        pokemonPreviewImage.alt = detail.name;
      }
      if (pokemonPreviewName) {
        pokemonPreviewName.textContent = detail.name;
      }
      if (pokemonSearchInput) {
        pokemonSearchInput.value = detail.name;
      }

      clearMatchesList();
    } catch (error) {
      showPokemonError(
        error?.message || "No se pudo obtener la información del Pokémon seleccionado."
      );
      if (pokemonPreviewName) {
        pokemonPreviewName.textContent = "";
      }
    }
  }

  // 3. Renderizar resultados filtrados de búsqueda
  function renderMatches(query) {
    clearMatchesList();

    if (!query) {
      return;
    }

    const matches = pokemonNames
      .filter((name) => name.toLowerCase().includes(query))
      .slice(0, SEARCH_MAX_RESULTS);

    for (const name of matches) {
      const matchItemElement = document.createElement("li");
      matchItemElement.className = "pokemon-match-item";
      matchItemElement.setAttribute("role", "button");
      matchItemElement.tabIndex = 0;
      matchItemElement.textContent = name;

      matchItemElement.addEventListener("click", () => {
        handleSelectPokemon(name);
      });

      matchItemElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelectPokemon(name);
        }
      });

      pokemonMatchesList.appendChild(matchItemElement);
    }
  }

  // 4. Búsqueda con debounce
  if (pokemonSearchInput) {
    pokemonSearchInput.addEventListener("input", (event) => {
      clearTimeout(debounceTimeoutId);
      const query = event.target.value.trim().toLowerCase();

      debounceTimeoutId = setTimeout(() => {
        renderMatches(query);
      }, SEARCH_DEBOUNCE_MS);
    });
  }

  // 5. Envío y validación del formulario
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let hasErrors = false;

    // Validación del nombre de usuario
    const rawUsername = usernameInput ? usernameInput.value : "";
    const usernameValidationMessage = validateUsername(rawUsername);

    if (usernameValidationMessage) {
      if (usernameError) {
        usernameError.textContent = usernameValidationMessage;
      }
      hasErrors = true;
    } else if (usernameError) {
      usernameError.textContent = "";
    }

    // Validación del Pokémon seleccionado
    if (!selectedPokemon || !selectedPokemon.name || !selectedPokemon.image) {
      showPokemonError("Debes seleccionar un Pokémon válido para tu perfil.");
      hasErrors = true;
    } else {
      clearPokemonError();
    }

    if (hasErrors) {
      return;
    }

    if (typeof onProfileCreated === "function") {
      onProfileCreated({
        username: rawUsername.trim(),
        pokemonId: selectedPokemon.id,
        pokemonName: selectedPokemon.name,
        pokemonImage: selectedPokemon.image,
      });
    }
  });
}
