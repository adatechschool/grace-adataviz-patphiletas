

export function afficherCards(data) {

  const tags = data.qfap_tags
  ? data.qfap_tags.split(";").map(tags => tags.trim())
  : [];

  return `
    <div class="card">
    <button class=audienceBtn>${data.audience}</button>      
    <div class="tags">
        ${tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")} 
      </div>
      <h2>${data.title}</h2>
      <h3>${data.address_name ?? ''}</h3> 
      <img src="${data.cover_url}" alt="Event titled ${data.title} " width="300">
      <p><strong>Date :</strong> ${data.date_start ?? 'Non communiquée'}</p>
      <p>
        <strong>Adresse :</strong> 

        ${data.address_street ?? ''}  
        ${data.address_zipcode ?? ''} 
        ${data.address_city ?? 'Non communiqué'}
      </p>

  
      <div class="descriptionHidden hidden"><p><strong>Description :</strong> ${data.lead_text ?? 'Non communiqué'} <br>${data.description}</p>
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

      e.target.textContent = desc.classList.contains("hidden")
        ? "Plus d'informations"
        : "Voir moins";
    }
  });
}

