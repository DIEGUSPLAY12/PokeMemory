import { fetchPokemonNames, fetchPokemonDetail } from "../services/pokeapi.js";
import { validateUsername } from "../utils/validators.js";
import { SEARCH_MAX_RESULTS, SEARCH_DEBOUNCE_MS } from "../utils/constants.js";

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
  let selectedPokemon = null;
  let debounceTimeoutId = null;

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
      const li = document.createElement("li");
      li.className = "pokemon-match-item";
      li.setAttribute("role", "button");
      li.tabIndex = 0;
      li.textContent = name;

      li.addEventListener("click", () => {
        handleSelectPokemon(name);
      });

      li.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelectPokemon(name);
        }
      });

      pokemonMatchesList.appendChild(li);
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
