

import { recupererDonnees } from './event.js';
import { afficherCards } from "./dom.js";



let dataTotal = [];
let currentIndex = 0;
const limit = 3;

async function afficherDonnees() {
  dataTotal = await recupererDonnees(); 
  initialiserPage();
  afficherMorceaux(); 
}

  

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