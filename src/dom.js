function formatDate(dateString) {
  if (!dateString) return "Date non communiquée";

  const date = new Date(dateString);

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// -----------------

export function afficherCards(data) {
  const tags = data.qfap_tags
    ? data.qfap_tags.split(";").map(tag => tag.trim())
    : [];
  const dateLisible = formatDate(data.date_start);

  return `
    <div class="card">
      <button class="audienceBtn">${data.audience}</button>      
      <div class="tags">
        ${tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join(" ")} 
      </div>
      <h2>${data.title}</h2>
      <h3>${data.address_name ?? ''}</h3> 
      <img src="${data.cover_url}" alt="Event titled ${data.title}" width="300">
      <p><strong>Date :</strong> ${dateLisible}</p>
      <p>
        <strong>Adresse :</strong> 
        ${data.address_street ?? ''}  
        ${data.address_zipcode ?? ''} 
        ${data.address_city ?? 'Non communiquée'}
      </p>
      <div class="descriptionHidden hidden">
        <p><strong>Description :</strong> ${data.lead_text ?? 'Non communiqué'} <br>${data.description}</p>
        <p><strong>Mail :</strong> ${data.contact_mail ?? 'Non communiqué'}</p>
      </div>
      <button class="toggleDescription">Voir plus</button>
    </div>
  `;
}
// --------------------


let toggleListenerInitialized = false;

export function activerToggleDescription() {
  if (toggleListenerInitialized) return; // Évite les doublons
  
  toggleListenerInitialized = true;
  
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggleDescription")) {
      const card = e.target.closest(".card");
      const desc = card.querySelector(".descriptionHidden");

      desc.classList.toggle("hidden");

      e.target.textContent = desc.classList.contains("hidden")
        ? "Voir plus"
        : "Voir moins";
    }
  });
}

// ------------------------
// Clear search

document.addEventListener("click", (e) => {
  if (e.target.id === "clear-search") {
    const input = document.getElementById("search");
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("input")); 
    }
  }
});