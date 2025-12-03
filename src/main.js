
// import { displayEvents } from "./event.js";
// / import { affichage_element } from "./dom.js";


// Fonction qui va chercher les données en API
async function recupererDonnees() {
  try {
    const response = await fetch(
      'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=20'
    );

    // On convertit la réponse brute en JSON
    const data = await response.json();

    // L'API met les vrais résultats dans data.results
    return data.results;

  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Fonction qui va afficher les données dans la page
async function afficherDonnees() {
  // On attend que les données soient récupérées
  const evenements = await recupererDonnees();

  // On crée un vrai élément HTML <div>
  const conteneur = document.createElement('div');

  // Une variable qui servira à stocker du HTML
  let html = '';

  // On boucle sur chaque événement (item)
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

  // On met tout le HTML généré dans le conteneur
  conteneur.innerHTML = html;

  // IMPORTANT : on ajoute enfin le conteneur au body
  document.body.appendChild(conteneur);
}

// On lance l’affichage
afficherDonnees();
