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
  if (dataTotal[0] && dataTotal[0].cover_url) {
    head.style.backgroundImage = `url('${dataTotal[0].cover_url}')`;
  }
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
    <h1>Liste des événements<br> à Paris</h1><br>
    <input 
      type="text" 
      id="search"
      style="width: 80%; margin-bottom: 20px; font-size: 16px;" 
      placeholder="Rechercher..."><br>`;
  
  conteneur.innerHTML = `
    <div id="cards-list"></div>
    <button id="voirPlus">Voir plus</button>
  `;


  document.getElementById("voirPlus").addEventListener("click", afficherMorceaux);

  // 🔥 le champ existe maintenant → on peut écouter
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
  const filteredData = dataTotal.filter(event => {
    const title = event.title?.toLowerCase() ?? "";
    const description = event.description?.toLowerCase() ?? "";
    return (
      title.includes(query.toLowerCase()) ||
      description.includes(query.toLowerCase())
    );
  });

  const cardsList = document.getElementById('cards-list');
  cardsList.innerHTML = '';

  filteredData.forEach(event => {
    cardsList.innerHTML += afficherCards(event);
  });

  activerTags();
  activerToggleDescription();
}

// -------------------------------------

function filtrerParTag(tag) {
  const conteneur = document.getElementById("cards-list");
  conteneur.innerHTML = "";

  const filtered = dataTotal.filter(evt =>
    evt.qfap_tags?.toLowerCase().includes(tag.toLowerCase())
  );

  filtered.forEach(data => {
    conteneur.innerHTML += afficherCards(data);
  });
}
filtrerParTag(tag);