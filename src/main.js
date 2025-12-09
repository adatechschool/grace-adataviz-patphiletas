import { recupererDonnees } from './event.js';
import { afficherCards, activerToggleDescription } from "./dom.js";
import { activerTags } from './event.js';

let dataTotal = [];
let currentIndex = 0;
const limit = 3;

// ---------------------------------

async function afficherDonnees() {
  dataTotal = await recupererDonnees(); 

  initialiserPage();   
  afficherMorceaux(); 
  activerToggleDescription();
}

afficherDonnees();

// ---------------------------------

function initialiserPage() {
  const conteneur = document.getElementById('events-container');
  const head = document.getElementById('head');

 head.innerHTML = `
  <div class="content">
    <a href="#top" class="headerTitleLink">
      <h1>Que faire à <em>Paris</em> ?</h1>
    </a>
    <div style="position: relative; display: inline-block; width: 100%; max-width: 500px;">
      <label for="search" class="sr-only">Recherche d'événements</label>
      <input 
        type="text" 
        id="search"
        placeholder="Rechercher..."
        style="
          width: 100%; 
          padding: 8px 35px 8px 12px;
          font-size: 1rem;
          border-radius: 6px;
          border: none;
          outline: none;
          box-sizing: border-box;
        "
      >
      <button 
        id="clear-search" 
        style="
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          font-size: 22px;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 24px;
          height: 24px;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
        ×
      </button>
    </div>
  </div>
`;

  conteneur.innerHTML = `
    <div id="cards-list"></div>
    <button id="voirPlus">Voir plus d'événements</button>
    <button id="debutBtn" style="display: none;">↑ Haut de page</button>
  `;

  document.getElementById("voirPlus").addEventListener("click", afficherMorceaux);

  document.getElementById("search").addEventListener("input", (ev) => {
    rechercherEvenements(ev.target.value);
  });

  document.getElementById("debutBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

// ------------------------------

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

// ------------------------

function filtrerParTag(tag) {
  const conteneur = document.getElementById("cards-list");
  conteneur.innerHTML = "";

  const filtered = dataTotal.filter(evt =>
    evt.qfap_tags?.toLowerCase().includes(tag.toLowerCase())
  );

  filtered.forEach(data => {
    conteneur.innerHTML += afficherCards(data);
  });

  activerTags();
}

window.filtrerParTag = filtrerParTag;

// ------------------------
// Afficher le bouton "Haut de page" après scroll
// ------------------------

window.addEventListener("scroll", () => {
  const btn = document.getElementById("debutBtn");
  if (btn) {
    if (window.scrollY > 300) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }
});