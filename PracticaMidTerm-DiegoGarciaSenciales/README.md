# PokeMemory

*Juego de memoria (Memory) interactivo con temática Pokémon desarrollado con JavaScript Vanilla y Vite, consumiendo datos en tiempo real de la PokeAPI.*

| Entrega | Detalle |
| :--- | :--- |
| **Nombre y apellidos** | Diego García Senciales |
| **URL de la aplicación desplegada** | [https://diegusplay12.github.io/PokeMemory/](https://diegusplay12.github.io/PokeMemory/) |
| **Vídeo de demostración** | pendiente |

[![Vite](https://img.shields.io/badge/Vite-3D7DCA?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-FFCB05?style=for-the-badge&logo=javascript&logoColor=222224)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-EE1515?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-3D7DCA?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![PokeAPI](https://img.shields.io/badge/PokeAPI-EE1515?style=for-the-badge&logo=pokemon&logoColor=white)](https://pokeapi.co/)

>  **Accede a la demo en vivo:** [https://diegusplay12.github.io/PokeMemory/](https://diegusplay12.github.io/PokeMemory/)

---

##  Descripción

PokeMemory es una aplicación web interactiva basada en el clásico juego de memoria (Memory) con temática Pokémon. El usuario comienza configurando su perfil de jugador con su nombre y seleccionando su Pokémon preferido mediante un buscador con sugerencias automáticas y vista previa oficial en tiempo real conectada a la PokeAPI. 

A continuación, puede iniciar partidas eligiendo la cantidad de cartas deseadas. El juego desafía a encontrar todas las parejas en el tablero animado en el menor tiempo posible, registrando los resultados en el historial del navegador y permitiendo filtrar y ordenar las marcas en una tabla de clasificación interactiva.

##  Vista previa

<!-- Pega aquí la captura de pantalla de la aplicación -->

##  Características

- **Perfil de jugador:** Formulario para registrar el nombre de usuario y un buscador interactivo con autocompletado para elegir un Pokémon favorito con vista previa en tiempo real.
- **Gestión de sesión:** Persistencia del perfil activo en `sessionStorage`, permitiendo cerrar sesión sin perder el historial guardado.
- **Configuración de partida:** Selector de cantidad de cartas con validación para asegurar un número par dentro de los límites válidos.
- **Tablero dinámico y responsivo:** Generación y barajado de parejas de cartas con imágenes oficiales de Pokémon obtenidas de la PokeAPI, dispuestas mediante CSS Grid adaptable a cualquier dispositivo.
- **Mecánica de memoria:** Volteo de cartas con control de estados (oculta, volteada o emparejada) y bloqueo preventivo del tablero mientras se valida la coincidencia.
- **Temporizador activo:** Cronómetro que mide en minutos y segundos el tiempo transcurrido hasta resolver el tablero.
- **Reinicio seguro:** Botón para reiniciar la partida en cualquier momento una vez comenzada.
- **Historial y ranking:** Registro de partidas completadas en `localStorage` con fecha, jugador, número de cartas y tiempo.
- **Controles avanzados del ranking:** Paginación incremental mediante botón "Ver más" (de 5 en 5), filtros combinables por nombre de jugador y por número de cartas, y ordenación por tiempo (más rápido primero o más lento primero).

##  Tecnologías

- **HTML5:** Marcado semántico estructurado por secciones y formulario accesible.
- **CSS3:** Variables nativas (`:root`) con la paleta de colores oficial de Pokémon, diseño responsive con media queries, Flexbox y CSS Grid adaptable.
- **JavaScript (ES Modules):** Arquitectura modular sin dependencias externas, separada en capas de interfaz, control de partida, almacenamiento y servicios.
- **PokeAPI:** API REST externa para la consulta y obtención de información y sprites de Pokémon.
- **Vite:** Entorno de desarrollo ágil y empaquetador para producción.
- **GitHub Actions & Pages:** Flujo CI/CD automatizado para el despliegue continuo de la aplicación estática.

##  Cómo ejecutar el proyecto

### Requisitos previos

- Disponer de **Node.js** (versión 18 o superior / versión LTS recomendada) y **npm** instalados en el sistema.

### Pasos de instalación y ejecución

1. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo local:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador la URL proporcionada por Vite (habitualmente `http://localhost:5173`).

### Otros comandos útiles

- Compilar la aplicación para producción:
  ```bash
  npm run build
  ```
- Previsualizar la compilación de producción localmente:
  ```bash
  npm run preview
  ```
- Analizar el código JavaScript con ESLint:
  ```bash
  npm run lint
  ```
- Validar el archivo HTML con HTMLHint:
  ```bash
  npm run lint:html
  ```

##  Estructura del proyecto

```text
PracticaMidTerm-DiegoGarciaSenciales/
├── public/                 # Recursos multimedia y archivos estáticos (favicon, logo e iconos)
├── src/                    # Código fuente de la aplicación
│   ├── game/               # Lógica del memory, controlador de partida y temporizador
│   ├── services/           # Conexión con PokeAPI (listado de Pokémon y sprites)
│   ├── storage/            # Módulos de persistencia (sessionStorage y localStorage)
│   ├── styles/             # Hoja de estilos CSS con paleta Pokémon y diseño responsive
│   ├── ui/                 # Manipulación del DOM y componentes visuales (perfil, juego, ranking)
│   ├── utils/              # Constantes del juego y funciones de validación
│   └── main.js             # Punto de entrada principal e inicialización de la app
├── index.html              # Estructura HTML de la página web
├── package.json            # Configuración del proyecto, dependencias y scripts de npm
└── vite.config.js          # Configuración de Vite con ruta base para GitHub Pages
```

## 📜 Créditos

- Datos e imágenes proporcionados por la API pública [PokeAPI](https://pokeapi.co/).
- Pokémon y los nombres de los personajes de Pokémon son marcas comerciales registradas de Nintendo, Creatures Inc., Game Freak Inc. y The Pokémon Company. Este proyecto ha sido desarrollado exclusivamente con fines educativos y formativos.
