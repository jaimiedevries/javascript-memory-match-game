
const pokeAPIBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';
const cardGrid = document.getElementById('card-grid');

let isPaused = false;
let firstPick;
let matches;

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
                        <p class="pokemon-name">${pokemon.name}</p>
                    </div>
                </div>
            `
    }).join('');
    cardGrid.innerHTML = pokemonHTML;
}

const clickCard = (e) => {
    const pokemonCard = e.currentTarget;
    const [front, back] = getFrontAndBackFromCard(pokemonCard);
    if (front.classList.contains('rotated') || isPaused) return;

    isPaused = true;

    rotateElements([front, back]);


    if (!firstPick) {
        firstPick = pokemonCard;
        isPaused = false;
    } else {
        const secondPokemonName = pokemonCard.dataset.pokename;
        const firstPokemonName = firstPick.dataset.pokename;
        if (firstPokemonName !== secondPokemonName) {
            const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);
            setTimeout(() => {
                rotateElements([front, back, firstFront, firstBack]);
                firstPick = null;
                isPaused = false;
            }, 500);

        } else {
            matches++;
            if (matches === 8) {
                console.log('winner');
            }
            firstPick = null;
            isPaused = false;
        }
    }
}

const rotateElements = (elements) => {
    // Eerst checken of elements een array is.
    if (typeof elements !== 'object' || !elements.length) return;
    elements.forEach(element => element.classList.toggle('rotated'));
}

const getFrontAndBackFromCard = (card) => {
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");
    return [front, back];
}

const resetGame = () => {
    cardGrid.innerHTML = '';
    isPaused = true;
    firstPick = null;
    matches = 0;

    setTimeout(async () => {
        const pokemon = await loadPokemon();
        displayPokemon([...pokemon, ...pokemon]);
        isPaused = false;
    }, 200)
}

resetGame();

// Note: Event propagation -> Use event.currentTager.