

export function afficherCards(data) {
return `
    <div class="card">
      <h2>${data.title}</h2>
      <img src="${data.cover_url}" alt="Event titled ${data.title} " width="300">
      <p><strong>Date :</strong> ${data.date_start ?? 'Non communiqué'}</p>
      <p>
        <strong>Lieu :</strong> 
        ${data.address_name ?? ''} 
        ${data.address_street ?? ''}  
        ${data.address_zipcode ?? ''} 
        ${data.address_city ?? 'Non communiqué'}
      </p>
      <div class="descriptionHidden"><p><strong>Description :</strong> ${data.lead_text ?? 'Non communiqué'} <br>${data.description}</p>
      <p><strong>Mail :</strong> ${data.contact_mail ?? 'Non communiqué'}</p>
      </div>
      <button class="toggleDescription">Voir plus</button>
    
      </div>
  `;
}

export function activerToggleDescription() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggleDescription")) {
      const card = e.target.closest(".card");
      const desc = card.querySelector(".descriptionHidden");

      desc.classList.toggle("hidden");

      // Optionnel : changer le texte du bouton
      e.target.textContent = desc.classList.contains("hidden")
        ? "Voir plus"
        : "Voir moins";
    }
  });
}