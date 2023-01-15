
const pokeAPIBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';
const cardGrid = document.getElementById('card-grid');

const loadPokemon = async () => {
    const randomIds = new Set();
    while (randomIds.size < 8) {
        const randomNumber = Math.ceil(Math.random() * 150);
        randomIds.add(randomNumber);
    }

    const pokePromises = [...randomIds].map(id => fetch(pokeAPIBaseUrl + id));
    const results = await Promise.all(pokePromises);
    return await Promise.all(results.map(res => res.json()));

}

const displayPokemon = (pokemon) => {
    pokemon.sort(_ => Math.random() - 0.5);
    const pokemonHTML = pokemon.map(pokemon => {
        return `
                <div class="grid-item" onclick="clickCard(event)" data-pokename="${pokemon.name}">
                    <div class="front">
                        <img src="/src/img/pokeball.svg"/>
                    </div>
                    <div class="back rotated">
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"/>
                        <p>${pokemon.name}</p>
                    </div>
                </div>
            `
    }).join('');
    cardGrid.innerHTML = pokemonHTML;
}

const clickCard = (e) => {
    const pokemonCard = e.currentTarget;
    const [front, back] = getFrontAndBackFromCard(pokemonCard);
    front.classList.toggle('rotated');
    back.classList.toggle('rotated');
}

const getFrontAndBackFromCard = (card) => {
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");
    return [front, back];
}

const resetGame = async () => {
    const pokemon = await loadPokemon();
    displayPokemon([...pokemon, ...pokemon]);
}

resetGame();

// Note: Event propagation -> Use event.currentTager.