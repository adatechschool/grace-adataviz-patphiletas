

import { recupererDonnees } from './event.js';
// import { afficherDonnees } from './dom.js';
import { afficherCards } from "./dom.js";



let dataTotal = [];

async function afficherDonnees() {
  const evenements = await recupererDonnees();
  const conteneur = document.getElementById('events-container');
  let html = [];
  evenements.forEach(data => {
    html.push(afficherCards(data)); 
  });
  conteneur.innerHTML = `<h1>Adataviz – Événements Paris</h1><br>
  <input 
  type="text" 
  id="search"
  style="width: 80%; margin-bottom: 20px; font-size: 16px;" 
  placeholder="Rechercher..."><br>${html.join('')}`;
}

afficherDonnees()
// // --------------------------------------------------------------------

// async function afficherCards() {



// }

