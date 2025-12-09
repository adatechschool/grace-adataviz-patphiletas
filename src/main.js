// main.js
import { recupererDonnees } from './event.js';
import { afficherCards, activerToggleDescription } from "./dom.js";
import { activerTags } from './event.js';

let dataTotal = [];
let currentIndex = 0;
const limit = 3;

// Déclaration des variables de gestion des tags (nécessaires pour le bon fonctionnement des tags)
let tagActif = null; 
window.gererTagClick = gererTagClick; 

// ---------------------------------
// NOUVELLE FONCTION DE TRI PAR DATE
// ---------------------------------
function trierDonneesParDate(data) {
  return data.sort((a, b) => {
    const dateA = new Date(a.date_start);
    const dateB = new Date(b.date_start);
    
    // Gérer les cas où la date est manquante (les mettre à la fin)
    if (!a.date_start) return 1;
    if (!b.date_start) return -1;

    // Trier du plus ancien au plus récent
    return dateA - dateB; 
  });
}
// ---------------------------------

async function afficherDonnees() {
  dataTotal = await recupererDonnees(); 
  
  // ÉTAPE 1 : Tri des données
  dataTotal = trierDonneesParDate(dataTotal); 

  // ÉTAPE 2 : Filtrage pour exclure les dates passées
  const maintenant = new Date();
  
  dataTotal = dataTotal.filter(event => {
    if (!event.date_start) {
      // Si la date de début est manquante, vous pouvez choisir de l'inclure ou de l'exclure.
      // Par défaut, nous allons l'exclure (retourne false) pour ne montrer que les événements datés.
      // Pour l'inclure, mettre `return true;`
      return false; 
    }
    const dateDebut = new Date(event.date_start);
    
    // Conserver si la date de début est égale ou postérieure à "maintenant"
    // On retire 1 jour pour être sûr que l'événement d'aujourd'hui ne soit pas retiré.
    return dateDebut >= maintenant;
  });

  initialiserPage();   
  afficherMorceaux(); 
  activerToggleDescription();
}
afficherDonnees()
// ---------------------------------

function initialiserPage() {
  const conteneur = document.getElementById('events-container');
  const head = document.getElementById('head');

  head.innerHTML = `
    <div class="content">
      <a href="#top" class="headerTitleLink">
        <h1>Que faire à <em>Paris</em> ?</h1>
      </a>

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
  tagActif = null; // Ajout pour réinitialiser l'état du tag actif

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

  const voirPlusBtn = document.getElementById("voirPlus"); // On référence le bouton
  
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
    // Masquer le bouton seulement si aucun résultat n'est trouvé.
    voirPlusBtn.style.display = "none"; 
    return;
  }
  
  // Afficher les résultats filtrés
  filteredData.forEach(event => {
    cardsList.innerHTML += afficherCards(event);
  });
  
  // Si des résultats sont trouvés, on affiche le bouton (au cas où il était masqué).
  // Note: lors d'une recherche, le bouton "Voir plus" n'est plus pertinent 
  // car nous affichons tous les résultats de la recherche. 
  // *Cependant*, si vous voulez qu'il reste visible pour revenir à l'affichage initial, 
  // il faut le laisser affiché ici.
  // Pour une recherche simple (afficher tout ce qui matche), il est courant de le masquer.
  // Gardons la version qui le masque, mais vous pouvez le changer en "block" si vous voulez qu'il reste visible :
  voirPlusBtn.style.display = "none"; // **CONSERVE L'ANCIEN COMPORTEMENT DE RECHERCHE SIMPLE**
  // Si vous souhaitez qu'il reste visible (afficher le bouton mais ne fait rien)
  // Mettre : voirPlusBtn.style.display = "block";


  activerTags();
}

// ------------------------
// Ajout de la logique de gestion de l'état du tag (pour les fonctions dans event.js)

function gererTagClick(tag) {
  if (tag === tagActif) {
    tagActif = null;
    resetAffichage();
  } else {
    tagActif = tag;
    filtrerParTag(tag);
  }
}

function filtrerParTag(tag) {
  const conteneur = document.getElementById("cards-list");
  conteneur.innerHTML = "";

  document.getElementById("voirPlus").style.display = "none";
  document.getElementById("search").value = "";
  document.getElementById("clear-search").style.display = "none";

  const filtered = dataTotal.filter(evt =>
    evt.qfap_tags?.toLowerCase().includes(tag.toLowerCase())
  );

  if (filtered.length === 0) {
    conteneur.innerHTML = `<div class="no-results">Aucun événement trouvé pour le tag « ${tag} ».</div>`;
  } else {
    filtered.forEach(data => {
      conteneur.innerHTML += afficherCards(data);
    });
  }

  // Mettre à jour la classe 'active'
  document.querySelectorAll(".tag").forEach(tagEl => {
    if (tagEl.dataset.tag === tagActif) {
      tagEl.classList.add("active");
    } else {
      tagEl.classList.remove("active");
    }
  });

  activerTags();
}
// Fin de l'ajout de la logique de gestion de l'état du tag
// ------------------------

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