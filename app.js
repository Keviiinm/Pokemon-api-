// ==========================================
// VARIABLES GLOBALES
// ==========================================

// ID del Pokémon actual (comenzamos con el Pokémon #1 - Bulbasaur)
let currentPokemonId = 1;

// URLs de la API de Pokémon
const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const POKEMON_SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species/';

// Obtener referencias a los elementos del DOM
const pokemonImage = document.getElementById('pokemonImage');
const pokemonName = document.getElementById('pokemonName');
const pokemonId = document.getElementById('pokemonId');
const pokemonTypes = document.getElementById('pokemonTypes');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const randomBtn = document.getElementById('randomBtn');

// Referencias para las estadísticas
const statElements = {
    hp: { bar: document.getElementById('stat-hp'), value: document.getElementById('stat-hp-value') },
    attack: { bar: document.getElementById('stat-attack'), value: document.getElementById('stat-attack-value') },
    defense: { bar: document.getElementById('stat-defense'), value: document.getElementById('stat-defense-value') },
    spAtk: { bar: document.getElementById('stat-spAtk'), value: document.getElementById('stat-spAtk-value') },
    spDef: { bar: document.getElementById('stat-spDef'), value: document.getElementById('stat-spDef-value') },
    speed: { bar: document.getElementById('stat-speed'), value: document.getElementById('stat-speed-value') }
};

// ==========================================
// FUNCIÓN: Obtener datos del Pokémon
// ==========================================

/**
 * Función asíncrona que obtiene los datos del Pokémon desde la API
 * y actualiza la interfaz con la información obtenida
 * @param {number} id - ID del Pokémon a obtener (1-1025)
 */
async function fetchPokemon(id) {
    try {
        // Mostrar mensaje de carga
        pokemonName.textContent = 'Cargando...';
        
        // Hacer la petición GET a la API de Pokémon
        const response = await fetch(`${POKEMON_API_URL}${id}`);
        
        // Validar que la respuesta sea correcta
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        
        // Convertir la respuesta a JSON
        const pokemonData = await response.json();
        
        // Actualizar la interfaz con los datos obtenidos
        updatePokemonUI(pokemonData);
        
        // Actualizar el ID global del Pokémon actual
        currentPokemonId = id;
        
    } catch (error) {
        // Mostrar error en la consola
        console.error('Error al obtener el Pokémon:', error);
        
        // Mostrar mensaje de error en la interfaz
        pokemonName.textContent = 'Error';
    }
}

// ==========================================
// FUNCIÓN: Actualizar la interfaz del usuario
// ==========================================

/**
 * Función que actualiza todos los elementos de la interfaz
 * con la información del Pokémon obtenida de la API
 * @param {object} pokemonData - Datos principales del Pokémon
 */
function updatePokemonUI(pokemonData) {
    // Actualizar el nombre del Pokémon
    // Capitalizar la primera letra del nombre
    pokemonName.textContent = capitalizeFirstLetter(pokemonData.name);
    
    // Actualizar el ID del Pokémon formateado
    pokemonId.textContent = `#${String(pokemonData.id).padStart(4, '0')}`;
    
    // Actualizar la imagen del Pokémon
    // Usar la imagen oficial de Pokemon.com si está disponible
    const imageUrl = pokemonData.sprites.other['official-artwork'].front_default || 
                    pokemonData.sprites.front_default;
    pokemonImage.src = imageUrl;
    pokemonImage.alt = pokemonData.name;
    
    // Actualizar los tipos del Pokémon
    updatePokemonTypes(pokemonData.types);
    
    // Actualizar las estadísticas del Pokémon
    updatePokemonStats(pokemonData.stats);
}

// ==========================================
// FUNCIÓN: Actualizar los tipos del Pokémon
// ==========================================

/**
 * Función que muestra los tipos del Pokémon con estilos específicos
 * @param {array} types - Array de tipos del Pokémon
 */
function updatePokemonTypes(types) {
    // Limpiar el contenedor de tipos
    pokemonTypes.innerHTML = '';
    
    // Iterar sobre cada tipo del Pokémon
    types.forEach(typeObj => {
        // Obtener el nombre del tipo (ej: 'fire', 'water')
        const typeName = typeObj.type.name;
        
        // Crear un elemento badge para el tipo
        const typeBadge = document.createElement('span');
        typeBadge.className = `type-badge type-${typeName}`;
        typeBadge.textContent = typeName;
        
        // Agregar el badge al contenedor
        pokemonTypes.appendChild(typeBadge);
    });
}

// ==========================================
// FUNCIÓN: Actualizar las estadísticas
// ==========================================

/**
 * Función que muestra las estadísticas del Pokémon con barras animadas
 * @param {array} stats - Array de estadísticas del Pokémon
 */
function updatePokemonStats(stats) {
    // El máximo valor de estadística en Pokémon es 255
    const maxStat = 150; // Usamos 150 como referencia visual
    
    // Mapear las estadísticas por nombre
    const statsMap = {};
    stats.forEach(stat => {
        statsMap[stat.stat.name] = stat.base_stat;
    });
    
    // Actualizar cada barra de estadística
    // HP
    const hp = statsMap['hp'];
    statElements.hp.value.textContent = hp;
    statElements.hp.bar.style.width = (hp / maxStat * 100) + '%';
    
    // Ataque
    const attack = statsMap['attack'];
    statElements.attack.value.textContent = attack;
    statElements.attack.bar.style.width = (attack / maxStat * 100) + '%';
    
    // Defensa
    const defense = statsMap['defense'];
    statElements.defense.value.textContent = defense;
    statElements.defense.bar.style.width = (defense / maxStat * 100) + '%';
    
    // Ataque Especial
    const spAtk = statsMap['special-attack'];
    statElements.spAtk.value.textContent = spAtk;
    statElements.spAtk.bar.style.width = (spAtk / maxStat * 100) + '%';
    
    // Defensa Especial
    const spDef = statsMap['special-defense'];
    statElements.spDef.value.textContent = spDef;
    statElements.spDef.bar.style.width = (spDef / maxStat * 100) + '%';
    
    // Velocidad
    const speed = statsMap['speed'];
    statElements.speed.value.textContent = speed;
    statElements.speed.bar.style.width = (speed / maxStat * 100) + '%';
}

// ==========================================
// FUNCIÓN: Capitalizar primera letra
// ==========================================

/**
 * Función auxiliar que capitaliza la primera letra de una cadena
 * @param {string} string - Cadena a capitalizar
 * @returns {string} - Cadena capitalizada
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ==========================================
// EVENTOS DE LOS BOTONES
// ==========================================

// Evento para el botón "Anterior"
// Decrementa el ID y obtiene el Pokémon anterior (mínimo ID 1)
prevBtn.addEventListener('click', () => {
    if (currentPokemonId > 1) {
        fetchPokemon(currentPokemonId - 1);
    } else {
        // Si estamos en el primer Pokémon, ir al último disponible
        fetchPokemon(1025); // Último Pokémon en la generación actual
    }
});

// Evento para el botón "Siguiente"
// Incrementa el ID y obtiene el siguiente Pokémon (máximo ID 1025)
nextBtn.addEventListener('click', () => {
    if (currentPokemonId < 1025) {
        fetchPokemon(currentPokemonId + 1);
    } else {
        // Si llegamos al último Pokémon, volver al primero
        fetchPokemon(1);
    }
});

// Evento para el botón "Aleatorio"
// Obtiene un Pokémon aleatorio entre 1 y 1025
randomBtn.addEventListener('click', () => {
    // Generar número aleatorio entre 1 y 1025
    const randomId = Math.floor(Math.random() * 1025) + 1;
    // Obtener el Pokémon con el ID aleatorio
    fetchPokemon(randomId);
});

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Cargar el primer Pokémon cuando la página se carga
// Llamamos a fetchPokemon con ID 1 para mostrar a Bulbasaur
fetchPokemon(1);