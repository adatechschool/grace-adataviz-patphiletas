
// import { displayEvents } from "./event.js";
// / import { affichage_element } from "./dom.js";

// --------------------------------------------------------------------

async function recupererDonnees() {
  try {
    const response = await fetch(
      'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=20'
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur:', error);
  }
}
// --------------------------------------------------------------------

async function afficherDonnees() {
  
  const evenements = await recupererDonnees();
  const conteneur = document.getElementById('events-container');
  let html = '';
  evenements.forEach(data => {
    html += `
      <article>
        <h2>${data.title}</h2>
        <img 
          src="${data.cover_url}" 
          alt="${data.title}" 
          width="300">
        <p><strong>Date :</strong> ${data.date_start ?? 'Non communiqué'}</p>
        <p>
          <strong>Lieu :</strong> 
          ${data.address_name ?? ''} 
          ${data.address_street ?? ''}  
          ${data.address_zipcode ?? ''} 
          ${data.address_city ?? ''}
        </p>
        <p><strong>Description: </strong> ${data.lead_text ?? 'Non communiqué'} <br>${data.description}</p>
        <p><strong>Mail :</strong> ${data.contact_mail ?? 'Non communiqué'}</p>
      </article>
    `;
  });
  conteneur.innerHTML = `<h1>Adataviz – Événements Paris</h1><br>${html}`;
}
afficherDonnees();

// --------------------------------------------------------------------


