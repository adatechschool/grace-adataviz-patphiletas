

import { recupererDonnees } from './event.js';
import { afficherDonnees } from './dom.js';


async function init() {
  const evenements = await recupererDonnees();
  afficherDonnees(evenements);
}

init();



// // --------------------------------------------------------------------

// async function afficherCards() {



// }

