

// // export const displayEvents = async function() {

export async function recupererDonnees(limit = 20) {
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