

import { recupererDonnees } from './event.js';
import { afficherCards } from "./dom.js";
import { activerToggleDescription } from "./dom.js";
import { activerTags } from './event.js';


let dataTotal = [];
let currentIndex = 0;
const limit = 3;

async function afficherDonnees() {
  dataTotal = await recupererDonnees(); 
  initialiserPage();
  activerToggleDescription();
  afficherMorceaux(); 
  filtrerParTag(tags)
  activerTags();
  
}
// ---------------------------------------------------

function initialiserPage() {
  const conteneur = document.getElementById('events-container');

  conteneur.innerHTML = `
    <h1>Adataviz – Événements Paris</h1><br>

    <input 
      type="text" 
      id="search"
      style="width: 80%; margin-bottom: 20px; font-size: 16px;" 
      placeholder="Rechercher..."><br>

    <div id="cards-list"></div>

    <button id="voirPlus">Voir plus</button>
  `;

document.getElementById("voirPlus").addEventListener("click", afficherMorceaux);
}
// ---------------------------------------------------

function afficherMorceaux() {
  const target = document.getElementById("cards-list");

  const slice = dataTotal.slice(currentIndex, currentIndex + limit);

  slice.forEach(data => {
    target.innerHTML += afficherCards(data);
  });

  currentIndex += limit;

  // Si plus rien à afficher → on cache le bouton
  if (currentIndex >= dataTotal.length) {
    document.getElementById("voirPlus").style.display = "none";
  }
}
afficherDonnees();


function rechercherEvenements(query) {
  const filteredData = dataTotal.filter(event => {
    const title = data.title ? data.title.toLowerCase() : '';
    const description = data.description ? data.description.toLowerCase() : '';
    return title.includes(query.toLowerCase()) || description.includes(query.toLowerCase());
  });

  const cardsList = document.getElementById('cards-list');
  cardsList.innerHTML = '';
  
  filteredData.forEach(data => {
    cardsList.innerHTML += afficherCards(data);
  });
}

document.getElementById('search').addEventListener('input', (event) => {
  rechercherEvenements(event.target.value);
});

rechercherEvenements();

// ---------------------------------------------------

function filtrerParTag(tag) {
  const conteneur = document.getElementById("cards-list");
  conteneur.innerHTML = "";

  const filtered = dataTotal.filter(data =>
    data.qfap_tags &&
    data.qfap_tags.toLowerCase().includes(tag.toLowerCase())
  );

  filtered.forEach(data => {
    conteneur.innerHTML += afficherCards(data);
    
  });
  
}
