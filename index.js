/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    for(const game of games){
        const gameCard = document.createElement("div");
        gameCard.classList.add("game-card");
        gameCard.innerHTML = `
        <h3>${game.name}</h3>
        <img src="${game.img}" alt="${game.name}" class="game-img">
        <p>Description: ${game.description}</p>
        <p>Pledged: $${game.pledged}</p>
        <p>Goal: $${game.goal}</p>
        <p>Backers: ${game.backers}</p>
    `;
    document.getElementById("games-container").appendChild(gameCard);
    }


}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, game) => accumulator + game.backers, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((accumulator, game) => accumulator + game.pledged, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.length;
gamesCard.innerHTML = `${totalGames}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
    const gamesContainer = document.getElementById("games-container");
    deleteChildElements(gamesContainer);
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}


// show only games that are fully funded
function filterFundedOnly() {
    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged > game.goal);
    const gamesContainer = document.getElementById("games-container");
    deleteChildElements(gamesContainer);
    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    const gamesContainer = document.getElementById("games-container");
    deleteChildElements(gamesContainer);
    addGamesToPage(GAMES_JSON);
    // add all games from the JSON data to the DOM

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

// Use reduce to sum the number of unfunded games
const totalUnfundedGames = unfundedGames.reduce((sum, game) => sum + 1, 0);

// create a string that explains the number of unfunded games using the ternary operator
const gamesWord = totalUnfundedGames === 1 ? "game" : "games";
const displayStr = 
    `A total of $${totalRaised.toLocaleString()} has been raised for ${totalGames}. 
    Currently, ${totalUnfundedGames} ${gamesWord} remains unfunded. We need your help to 
    fund these amazing games!`

// create a new DOM element containing the template string and append it to the description container
const newParagraph = document.createElement("p");
newParagraph.textContent = displayStr;
const desc = document.getElementById("description-container");
desc.appendChild(newParagraph);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

const [topGame, secondTopGame, ...restOfGames] = sortedGames;
// use destructuring and the spread operator to grab the first and second games

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameElement = document.createElement("p");
topGameElement.textContent = `${topGame.name}`;
// do the same for the runner up item
const secondTopGameElement = document.createElement("p");
secondTopGameElement.textContent = `${secondTopGame.name}`;
firstGameContainer.appendChild(topGameElement);

// grab the search input and search button elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// add an event listener to the search button
searchBtn.addEventListener("click", performSearch);

// function to perform the search
function performSearch() {
    // get the search query from the input box
    const searchTerm = searchInput.value.toLowerCase();

    // use filter to find the games that match the search query
    const searchResults = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchTerm));

    // clear the games container and display the search results
    const gamesContainer = document.getElementById("games-container");
    deleteChildElements(gamesContainer);
    addGamesToPage(searchResults);
    clearSearchInput();
}

// function to clear the search input when the user clicks on it
searchInput.addEventListener("click", clearSearchInput);


function clearSearchInput() {
    searchInput.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    // Select the navigation link
    const ourGamesLink = document.querySelector('a[href="#our-games"]');

    // Add a click event listener to the link
    ourGamesLink.addEventListener("click", function(event) {
        event.preventDefault();

        // Get the target element based on the href attribute
        const targetElement = document.getElementById("our-games");

        // Scroll to the target element with smooth behavior
        targetElement.scrollIntoView({ behavior: "smooth" });
    });
});