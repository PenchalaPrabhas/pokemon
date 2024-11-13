// Function to fetch and display Pokémon based on search input or randomly
function searchPokemon() {
  const searchType = document.getElementById('searchType').value;
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const resultsDiv = document.getElementById('results');

  // Clear previous results
  resultsDiv.innerHTML = '';

  // If no search input, fetch random Pokémon
  if (!searchInput) {
    fetchRandomPokemon(resultsDiv);
  } else {
    // Construct API URL based on the search type
    let url = '';
    if (searchType === 'name') {
      url = `https://pokeapi.co/api/v2/pokemon/${searchInput}`;
    } else if (searchType === 'ability') {
      url = `https://pokeapi.co/api/v2/ability/${searchInput}`;
    } else if (searchType === 'type') {
      url = `https://pokeapi.co/api/v2/type/${searchInput}`;
    }

    // Fetch data from the Pokémon API
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Pokémon not found');
        }
        return response.json();
      })
      .then(data => {
        let pokemonData = [];

        if (searchType === 'name') {
          pokemonData.push(data);
        } else if (searchType === 'ability' || searchType === 'type') {
          pokemonData = data.pokemon.slice(0, 90); // Limit to 6 Pokémon results
        }

        if (pokemonData.length === 0) {
          resultsDiv.innerHTML = 'No Pokémon found.';
        } else {
          pokemonData.forEach(entry => {
            const pokemonName = searchType === 'name' ? entry.name : entry.pokemon.name;
            const pokemonUrl = searchType === 'name' ? url : entry.pokemon.url;

            fetchPokemonDetails(pokemonUrl, pokemonName, resultsDiv);
          });
        }
      })
      .catch(error => {
        console.error(error);
        resultsDiv.innerHTML = 'Error fetching data, please try again later.';
      });
  }
}

// Helper function to fetch and display random Pokémon
// Modify the fetchRandomPokemon function to accept the resultsDiv parameter
function fetchRandomPokemon() {
  const resultsDiv = document.getElementById('results'); // Get the results div

  // Clear previous results
  resultsDiv.innerHTML = '';

  // Fetch a list of random Pokémon (we'll fetch 10 random Pokémon for now)
  const randomPokemonPromises = [];
  for (let i = 0; i < 30; i++) {
    const randomId = Math.floor(Math.random() * 1000) + 1; // Pokémon IDs range from 1 to 1000
    randomPokemonPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`).then(res => res.json()));
  }

  // Wait for all the random Pokémon fetches to complete
  Promise.all(randomPokemonPromises)
    .then(pokemonArray => {
      if (pokemonArray.length === 0) {
        resultsDiv.innerHTML = 'No Pokémon found.';
      } else {
        pokemonArray.forEach(pokemonDetails => {
          const pokemonName = pokemonDetails.name;
          const pokemonImage = pokemonDetails.sprites.front_default;

          // Display Pokémon details
          const pokemonElement = document.createElement('div');
          pokemonElement.classList.add('result');
          pokemonElement.innerHTML = `
            <div onclick="openPokemonInfo('${pokemonDetails.id}')">
              <img src="${pokemonImage}" alt="${pokemonName}">
              <h3>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h3>
            </div>
          `;
          resultsDiv.appendChild(pokemonElement);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching random Pokémon:', error);
      resultsDiv.innerHTML = 'Error fetching random Pokémon, please try again later.';
    });
}

// Function to fetch individual Pokémon details
function fetchPokemonDetails(url, pokemonName, resultsDiv) {
  fetch(url)
    .then(res => res.json())
    .then(pokemonDetails => {
      const pokemonImage = pokemonDetails.sprites.front_default;
      const pokemonTypes = pokemonDetails.types.map(typeInfo => typeInfo.type.name).join(', ');
      const pokemonAbilities = pokemonDetails.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
      const pokemonHeight = pokemonDetails.height / 10;
      const pokemonWeight = pokemonDetails.weight / 10;
      const pokemonStats = pokemonDetails.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');

      // Display Pokémon details with onclick to open Pokémon info
      const pokemonElement = document.createElement('div');
      pokemonElement.classList.add('result');
      pokemonElement.innerHTML = `
        <div onclick="openPokemonInfo('${pokemonDetails.id}')">
          <img src="${pokemonImage}" alt="${pokemonName}">
          <h3>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h3>
        </div>
      `;
      resultsDiv.appendChild(pokemonElement);
    })
    .catch(error => {
      console.error('Error fetching Pokémon details:', error);
    });
}

// Function to open Pokémon info page with query parameter
function openPokemonInfo(pokemonId) {
  window.location.href = `pokeinfo.html?id=${pokemonId}`;
}

// Call searchPokemon when the page loads
window.onload = searchPokemon;
// Function to open the popup
function infos() {
  const popup = document.getElementById("infoPopup");
  popup.style.display = "block"; // Show the popup
}

// Function to close the popup
function closePopup() {
  const popup = document.getElementById("infoPopup");
  popup.style.display = "none"; // Hide the popup
}

// Optional: Close the popup when the user clicks outside of it
window.onclick = function(event) {
  const popup = document.getElementById("infoPopup");
  if (event.target === popup) {
    popup.style.display = "none"; // Hide the popup if clicked outside
  }
}
