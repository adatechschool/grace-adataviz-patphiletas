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

      <!-- WRAPPER SEARCH -->
      <div id="search-wrapper"
        style="position: relative; width: 100%; max-width: 500px;">
        
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

        <!-- CLEAR BUTTON -->
        <button 
          id="clear-search"
          style="
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            font-size: 1.1rem;
            cursor: pointer;
            display: none;
          "
        >✕</button>

      </div>

      <button id="reset-filters">Réinitialiser</button>
    </div>
  `;

  conteneur.innerHTML = `
    <div id="cards-list"></div>
    <button id="voirPlus">Voir plus d'événements</button>
    <button id="debutBtn" style="display: none;">↑ Haut de page</button>
  `;

  // ---------------------
  // EVENTS SEARCH & CLEAR
  // ---------------------
  const searchInput = document.getElementById("search");
  const clearBtn = document.getElementById("clear-search");
  

  searchInput.addEventListener("input", (ev) => {
    const value = ev.target.value;
    rechercherEvenements(value);
    clearBtn.style.display = value ? "block" : "none";
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none";
    resetAffichage();
  });

  // Voir plus
  document.getElementById("voirPlus").addEventListener("click", afficherMorceaux);

  // Retour haut de page
  document.getElementById("debutBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Reset filtres
  document.getElementById("reset-filters").addEventListener("click", resetAffichage);
}

// -------------------------------------

async function resetAffichage() {

  // Remet les 3 cartes du début
  const data = dataTotal.slice(0, 3);
  currentIndex = 3;

  const cardsList = document.getElementById("cards-list");
  cardsList.innerHTML = "";
  data.forEach(evt => cardsList.innerHTML += afficherCards(evt));

  // Reset UI
  document.getElementById("voirPlus").style.display = "block";
  document.getElementById("search").value = "";
  document.getElementById("clear-search").style.display = "none";
  document.querySelectorAll(".tag.active").forEach(tag => tag.classList.remove("active"));

  activerTags();
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
// Bouton haut de page
// ------------------------

window.addEventListener("scroll", () => {
  const btn = document.getElementById("debutBtn");
  if (btn) {
    btn.style.display = window.scrollY > 300 ? "block" : "none";
  }
});
