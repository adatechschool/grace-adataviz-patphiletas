

import { recupererDonnees } from './event.js';
// import { afficherDonnees } from './dom.js';
import { card } from "./dom.js";


// async function init() {
//   const evenements = await recupererDonnees();
//   afficherDonnees(evenements);
// }

// init();



async function afficherDonnees() {
  const evenements = await recupererDonnees();
  const conteneur = document.getElementById('events-container');
  let html = [];
  evenements.forEach(data => {
    html.push(card(data)); 
  });
  conteneur.innerHTML = `<h1>Adataviz – Événements Paris</h1><br>
  <input 
  type="text" 
  id="search" 
  placeholder="Rechercher un événement..."><br>${html.join('')}`;
}

afficherDonnees()
// // --------------------------------------------------------------------

// async function afficherCards() {



// }

