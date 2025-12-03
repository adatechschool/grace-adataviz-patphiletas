

// export const displayEvents = async function() {

export function afficherDonnees(evenements) {
  const conteneur = document.getElementById('events-container');
  let html = '';
  
  evenements.forEach(data => {
    html += `
      <article>
        <h2>${data.title}</h2>
        <img src="${data.cover_url}" alt="${data.title}" width="300">
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


