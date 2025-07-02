const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

// Variables búsqueda
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const clearSearch = document.querySelector("#clearSearch");

// 🔸 Función para cargar Pokémon por un rango de IDs
function cargarPokemonPorRango(start, end) {
    listaPokemon.innerHTML = "<div class='loading'>Cargando Pokémon...</div>";

    let pokemons = [];
    let requests = [];

    for (let i = start; i <= end; i++) {
        requests.push(
            fetch(URL + i)
                .then(res => res.json())
                .then(data => {
                    pokemons.push(data);
                })
        );
    }

    Promise.all(requests).then(() => {
        pokemons.sort((a, b) => a.id - b.id);
        listaPokemon.innerHTML = "";
        pokemons.forEach(poke => mostrarPokemon(poke));
    });
}

// 🔍 Función búsqueda
function searchPokemon() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        cargarPokemonPorRango(1, 386);
        return;
    }

    listaPokemon.innerHTML = "<div class='loading'>Buscando Pokémon...</div>";

    fetch(URL + searchTerm)
        .then(response => {
            if (!response.ok) throw new Error("No encontrado");
            return response.json();
        })
        .then(data => {
            listaPokemon.innerHTML = "";
            mostrarPokemon(data);
            clearSearch.classList.add("visible");
        })
        .catch(() => {
            searchAllPokemon(searchTerm);
        });
}

// 🔍 Búsqueda más amplia
function searchAllPokemon(searchTerm) {
    listaPokemon.innerHTML = "<div class='loading'>Buscando Pokémon...</div>";
    let found = false;
    let pokemons = [];
    let requests = [];

    for (let i = 1; i <= 386; i++) {
        requests.push(
            fetch(URL + i)
                .then(response => response.json())
                .then(data => {
                    if (data.name.toLowerCase().includes(searchTerm)) {
                        pokemons.push(data);
                        found = true;
                        clearSearch.classList.add("visible");
                    }
                })
        );
    }

    Promise.all(requests).then(() => {
        if (found) {
            pokemons.sort((a, b) => a.id - b.id);
            listaPokemon.innerHTML = "";
            pokemons.forEach(poke => mostrarPokemon(poke));
        } else {
            listaPokemon.innerHTML = `<div class="no-results">No se encontraron Pokémon con "${searchTerm}"</div>`;
            clearSearch.classList.remove("visible");
        }
    });
}

// 🔥 Eventos búsqueda
searchButton.addEventListener("click", searchPokemon);

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchPokemon();
    }

    if (searchInput.value.trim() !== "") {
        clearSearch.classList.add("visible");
    } else {
        clearSearch.classList.remove("visible");
    }
});

clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.classList.remove("visible");
    cargarPokemonPorRango(1, 386);
});

// 🔥 Botones de filtros
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    searchInput.value = "";
    clearSearch.classList.remove("visible");
    listaPokemon.innerHTML = "";

    if (botonId === "ver-todos") {
        cargarPokemonPorRango(1, 1025);
    } 
    else if (botonId === "generacion-1") {
        cargarPokemonPorRango(1, 151);
    } 
    else if (botonId === "generacion-2") {
        cargarPokemonPorRango(152, 251);
    } 
    else if (botonId === "generacion-3") {
        cargarPokemonPorRango(252, 386);
    } 
    else if (botonId === "generacion-4") {
        cargarPokemonPorRango(387, 493);
    } 
    else if (botonId === "generacion-5") {
        cargarPokemonPorRango(494, 649);
    } 
    else if (botonId === "generacion-6") {
        cargarPokemonPorRango(650, 721);
    } 
    else if (botonId === "generacion-7") {
        cargarPokemonPorRango(722, 809);
    } 
    else if (botonId === "generacion-8") {
        cargarPokemonPorRango(810, 905);
    } 
    else if (botonId === "generacion-9") {
        cargarPokemonPorRango(906, 1025);
    } 
    else {
        // 🔥 Filtro por tipo
        listaPokemon.innerHTML = "<div class='loading'>Cargando Pokémon...</div>";

        let pokemons = [];
        let requests = [];

        for (let i = 1; i <= 1025; i++) {
            requests.push(
                fetch(URL + i)
                    .then(res => res.json())
                    .then(data => {
                        const tipos = data.types.map(type => type.type.name);
                        if (tipos.includes(botonId)) {
                            pokemons.push(data);
                        }
                    })
            );
        }

        Promise.all(requests).then(() => {
            pokemons.sort((a, b) => a.id - b.id);
            listaPokemon.innerHTML = "";
            pokemons.forEach(poke => mostrarPokemon(poke));
        });
    }
}));

// 🔸 Mostrar Pokémon
function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');

    const stats = poke.stats.map(stat => {
        return {
            name: stat.stat.name,
            value: stat.base_stat
        };
    });

    const statsHTML = stats.map(stat => `
        <div class="stat-row">
            <span class="stat-name">${formatStatName(stat.name)}:</span>
            <span class="stat-value">${stat.value}</span>
            <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${(stat.value / 255) * 100}%"></div>
            </div>
        </div>
    `).join('');

    let pokeId = poke.id.toString().padStart(3, '0');

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <div class="physical-stats">
                    <p class="stat"><i class="fas fa-ruler-vertical"></i> ${poke.height / 10}m</p>
                    <p class="stat"><i class="fas fa-weight"></i> ${poke.weight / 10}kg</p>
                </div>
                <div class="battle-stats">
                    ${statsHTML}
                </div>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

function formatStatName(name) {
    const statNames = {
        'hp': 'HP',
        'attack': 'Attack',
        'defense': 'Defense',
        'special-attack': 'Sp. Atk',
        'special-defense': 'Sp. Def',
        'speed': 'Speed'
    };
    return statNames[name.toLowerCase()] || name;
}

cargarPokemonPorRango(1, 386);
