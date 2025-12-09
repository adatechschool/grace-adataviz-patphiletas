// import { afficherCards } from "./card.js";

export async function recupererDonnees(limit = 60) {

  try {
    const response = await fetch(
      `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=${limit}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

// ------------------------

export function activerTags() {
  document.querySelectorAll(".tag").forEach(tagEl => {
    tagEl.addEventListener("click", () => {
      const tag = tagEl.dataset.tag;
      console.log("Tag cliqué :", tag);
      filtrerParTag(tag)
    });
  });
}