// Fonction pour effectuer la requête d'itinéraire à l'API OpenRouteService
function rechercherItineraires(villeDepart, villeArrivee) {
  // Clé d'accès à l'API OpenRouteService (remplacez par votre propre clé)
  const apiKey = '5b3ce3597851110001cf624815dbf64ad38949df9bfca1525c2137c6';

  // URL de l'API OpenRouteService
  const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${villeDepart}&end=${villeArrivee}`;

  // Sélectionner l'élément où afficher les résultats
 const resultatContainer = document.getElementById('resultats');

  // Effacer les résultats précédents, le cas échéant
  resultatContainer.innerHTML = '';

  // Effectuer la requête GET à l'API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Traiter la réponse de l'API et récupérer les itinéraires
      const itineraires = [];

      // Boucle sur les itinéraires retournés par l'API
      data.features.forEach(feature => {
        const itineraire = {
          distance: feature.properties.summary.distance,
          duration: feature.properties.summary.duration,
          instructions: feature.properties.segments[0].steps.map(step => step.instruction)
        };

        // Ajouter l'itinéraire à la liste des résultats
        itineraires.push(itineraire);
      });

      // Afficher les itinéraires sur la page
      itineraires.forEach((itineraire, index) => {
        const resultat = document.createElement('div');
        resultat.classList.add('resultat');

        const titre = document.createElement('h3');
        titre.textContent = `Itinéraire ${index + 1}`;

        const distance = document.createElement('p');
        distance.textContent = `Distance : ${itineraire.distance} m`;

        const duree = document.createElement('p');
        duree.textContent = `Durée : ${itineraire.duration} s`;

        const instructions = document.createElement('ul');
        itineraire.instructions.forEach(instruction => {
          const instructionItem = document.createElement('li');
          instructionItem.textContent = instruction;
          instructions.appendChild(instructionItem);
        });

        resultat.appendChild(titre);
        resultat.appendChild(distance);
        resultat.appendChild(duree);
        resultat.appendChild(instructions);

        resultatContainer.appendChild(resultat);
      });
    })
    .catch(error => {
      // Gérer les erreurs de requête
      console.error('Une erreur s\'est produite lors de la récupération des itinéraires :', error);
    });
}