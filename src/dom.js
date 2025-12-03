



export function afficherCards(data) {
return `
    <article>
      <h2>${data.title}</h2>
      <img src="${data.cover_url}" alt="Event titled ${data.title} featuring a visual representation related to the event. The image showcases the atmosphere of the event, highlighting key elements that convey its theme." width="300">
      <p><strong>Date :</strong> ${data.date_start ?? 'Non communiqué'}</p>
      <p>
        <strong>Lieu :</strong> 
        ${data.address_name ?? ''} 
        ${data.address_street ?? ''}  
        ${data.address_zipcode ?? ''} 
        ${data.address_city ?? 'Non communiqué'}
      </p>
      <p><strong>Description :</strong> ${data.lead_text ?? 'Non communiqué'} <br>${data.description}</p>
      <p><strong>Mail :</strong> ${data.contact_mail ?? 'Non communiqué'}</p>
    </article>
  `;
}