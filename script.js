// Récupération du formulaire et du conteneur de résultats
const form = document.getElementById("search-form");
const resultsContainer = document.getElementById("results");

// Écouteur d'événement sur la soumission du formulaire
form.addEventListener("submit", function(e) {
  e.preventDefault(); // Empêche le comportement par défaut du formulaire

  // Récupération des valeurs des champs de saisie
  const villeDepart = document.getElementById("ville-depart").value;
  const villeArrivee = document.getElementById("ville-arrivee").value;

  // Appel à une fonction pour récupérer les itinéraires depuis une API ou un service
  const itineraires = rechercherItineraires(villeDepart, villeArrivee);

  // Effacer les résultats précédents
  resultsContainer.innerHTML = "";

  // Afficher les itinéraires dans le conteneur de résultats
  itineraires.forEach(function(itineraire) {
    const result = document.createElement("div");
    result.innerHTML = "<p>Itinéraire : " + itineraire + "</p>";
    resultsContainer.appendChild(result);
  });
});

// Fonction fictive pour simuler la récupération des itinéraires depuis une API ou un service
function rechercherItineraires(villeDepart, villeArrivee) {
  // Ici, vous pouvez effectuer une requête vers une API ou un service
  // pour récupérer les itinéraires en fonction des villes de départ et d'arrivée
  // et retourner les résultats sous forme d'un tableau
  // Cela dépendra de l'API ou du service que vous utilisez réellement
  // Dans cet exemple, je vais simplement retourner des valeurs statiques

  return [
    "Itinéraire 1",
    "Itinéraire 2",
    "
