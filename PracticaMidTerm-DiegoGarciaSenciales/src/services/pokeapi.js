import { POKEAPI_BASE_URL } from "../utils/constants.js";

// Cache en memoria para almacenar la lista de nombres de Pokémon
let cacheNombres = null;

// Obtiene la lista completa de nombres de Pokémon desde la API o la cache
export async function fetchPokemonNames() {
  if (cacheNombres) {
    return cacheNombres;
  }

  const respuesta = await fetch(`${POKEAPI_BASE_URL}?limit=100000`);
  if (!respuesta.ok) {
    throw new Error("No se pudo obtener la lista de Pokémon");
  }

  const datos = await respuesta.json();
  cacheNombres = datos.results.map((pokemon) => pokemon.name);
  return cacheNombres;
}

// Obtiene los datos detallados de un Pokémon por su id o nombre
export async function fetchPokemonDetail(idOrName) {
  const respuesta = await fetch(`${POKEAPI_BASE_URL}/${idOrName}`);
  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener el detalle del Pokémon: ${idOrName}`);
  }

  const datos = await respuesta.json();
  const imagenOficial = datos.sprites?.other?.["official-artwork"]?.front_default;
  const imagenPorDefecto = datos.sprites?.front_default;
  const image = imagenOficial ?? imagenPorDefecto ?? null;

  return {
    id: datos.id,
    name: datos.name,
    image,
  };
}

// Obtiene una cantidad determinada de Pokémon aleatorios distintos con imagen
export async function fetchRandomPokemons(count) {
  const nombresDisponibles = await fetchPokemonNames();

  if (count > nombresDisponibles.length) {
    throw new Error("La cantidad solicitada supera los nombres de Pokémon disponibles");
  }

  const pokemonValidos = [];
  const nombresUsados = new Set();

  while (pokemonValidos.length < count) {
    const faltantes = count - pokemonValidos.length;
    if (nombresUsados.size >= nombresDisponibles.length) {
      throw new Error("No hay suficientes Pokémon con imagen disponibles");
    }

    const nombresLote = [];
    while (nombresLote.length < faltantes && nombresUsados.size < nombresDisponibles.length) {
      const indiceAleatorio = Math.floor(Math.random() * nombresDisponibles.length);
      const nombreCandidato = nombresDisponibles[indiceAleatorio];

      if (!nombresUsados.has(nombreCandidato)) {
        nombresUsados.add(nombreCandidato);
        nombresLote.push(nombreCandidato);
      }
    }

    const detalles = await Promise.all(
      nombresLote.map((nombre) => fetchPokemonDetail(nombre))
    );

    for (const detalle of detalles) {
      if (detalle.image) {
        pokemonValidos.push(detalle);
        if (pokemonValidos.length === count) {
          break;
        }
      }
    }
  }

  return pokemonValidos;
}
