
// import { displayEvents } from "./event.js";
// / import { affichage_element } from "./dom.js";


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

async function afficherDonnees() {
  const evenements = await recupererDonnees();

  const conteneur = document.createElement('div');

  let html = '';

  evenements.forEach(item => {
    html += `
      <article>
        <h2>${item.title}</h2>

        <img 
          src="${item.cover_url}" 
          alt="${item.title}" 
          width="300"
        >

        <p><strong>Date :</strong> ${item.date_start ?? 'Non communiqué'}</p>

        <p>
          <strong>Lieu :</strong> 
          ${item.address_name ?? ''} 
          ${item.address_street ?? ''} 
          ${item.address_zipcode ?? ''} 
          ${item.address_city ?? ''}
        </p>
        <p><strong>Description: </strong> ${item.lead_text ?? 'Non communiqué'} <br>${item.description}</p>

        <p><strong>Contact :</strong> ${item.contact_mail ?? 'Non communiqué'}</p>
      </article>
    `;
  });

  conteneur.innerHTML = html;

  document.body.appendChild(conteneur);
}

afficherDonnees();
