import { recupererDonnees } from './event.js';
import { afficherCards } from "./dom.js";
import { activerToggleDescription } from "./dom.js";
import { activerTags } from './event.js';

let dataTotal = [];
let currentIndex = 0;
const limit = 3;

// -------------------------------------

async function afficherDonnees() {
  dataTotal = await recupererDonnees(); 
    const head = document.getElementById("head");

  initialiserPage();   
  afficherMorceaux(); 
  activerToggleDescription();
}
afficherDonnees();

// -------------------------------------

function initialiserPage() {
  const conteneur = document.getElementById('events-container');
  const head = document.getElementById('head');

  head.innerHTML = `
  <div style="text-align: center;">
    <h1>Que faire à <em>Paris</em> ?</h1>
    <div class="search-wrapper" 
  <div style="text-align: center; width: 20%;">
      
      <input 
        type="text" 
        id="search"
        placeholder="Rechercher..."
        style="width: 100%; align-text: center; padding-right: 35px; font-size: 16px;"
      >

      <button 
        id="clear-search" 
        style="
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          line-height: 1;
          padding: 0;
        ">
        ×
      </button>

    </div>
    `;
  conteneur.innerHTML = `
    <div id="cards-list"></div>
    <button id="voirPlus">Voir plus de pages</button>
  `;
const headBg = document.querySelector('#head .bg');

  document.getElementById("voirPlus").addEventListener("click", afficherMorceaux);

  document.getElementById("search").addEventListener("input", (ev) => {
    rechercherEvenements(ev.target.value);
  });
}

// -------------------------------------

function afficherMorceaux() {
  const target = document.getElementById("cards-list");
  const slice = dataTotal.slice(currentIndex, currentIndex + limit);

  slice.forEach(data => {
    target.innerHTML += afficherCards(data);
  });

  currentIndex += limit;

  if (currentIndex >= dataTotal.length) {
    document.getElementById("voirPlus").style.display = "none";
  }

  activerTags();
}

// -------------------------------------

function rechercherEvenements(query = "") {
  const cardsList = document.getElementById("cards-list");
  cardsList.innerHTML = "";

  const normalizedQuery = query.trim().toLowerCase();

  const filteredData = dataTotal.filter(event => {
    const title = event.title?.toLowerCase() ?? "";
    const description = event.description?.toLowerCase() ?? "";
    const tags = event.qfap_tags?.toLowerCase() ?? "";
    const audience = event.audience?.toLowerCase() ?? "";

    return (
      title.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      tags.includes(normalizedQuery) ||
      audience.includes(normalizedQuery)
    );
  });

  if (filteredData.length === 0) {
    cardsList.innerHTML = `
      <div class="no-results">
        Aucun événement ne correspond à « ${query} ».
      </div>
    `;
    return;
  }

  filteredData.forEach(event => {
    cardsList.innerHTML += afficherCards(event);
  });

  activerTags();
}


// -------------------------------------

function filtrerParTag(tags) {
  const conteneur = document.getElementById("cards-list");
  conteneur.innerHTML = "";

  const filtered = dataTotal.filter(evt =>
    evt.qfap_tags?.toLowerCase().includes(tags.toLowerCase())
  );

  filtered.forEach(data => {
    conteneur.innerHTML += afficherCards(data);
  });
}
filtrerParTag(tags);