
  //  const apiKey = '5b3ce3597851110001cf624815dbf64ad38949df9bfca1525c2137c6';

// mapboxgl.accessToken = 'pk.eyJ1Ijoidml2ZWxlaGlwaG9wIiwiYSI6ImNsaGY3aWJtdTEzengzbXBjdGRuN2g5dmMifQ.bd1-dun6CWxBoQG006CgOw';


// Sélectionner le formulaire de recherche
const searchForm = document.getElementById('search-form');

// Ajouter un gestionnaire d'événement pour l'événement "submit" du formulaire
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Empêcher le rechargement de la page

  // Récupérer les valeurs des champs de saisie
  const villeDepart = document.getElementById('ville-depart').value;
  const villeArrivee = document.getElementById('ville-arrivee').value;

  // Geocodage de la ville de départ avec Mapbox
  geocoder(villeDepart, (departCoordinates) => {
    // Geocodage de la ville d'arrivée avec Mapbox
    geocoder(villeArrivee, (arriveeCoordinates) => {
      // Appeler la fonction de recherche d'itinéraire avec les coordonnées géographiques
      rechercherItineraires(departCoordinates, arriveeCoordinates);
    });
  });
});

// Fonction de géocodage avec Mapbox
function geocoder(ville, callback) {
  const accessToken = 'pk.eyJ1Ijoidml2ZWxlaGlwaG9wIiwiYSI6ImNsaGY3ZnNteTFucHEzZXBjdWRpbHVleWMifQ.oQnzrda4UJ1rMR1YeEINhA';
  const geocodingApiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${ville}.json?access_token=${accessToken}`;

  fetch(geocodingApiUrl)
    .then(response => response.json())
    .then(data => {
      const coordinates = data.features[0].center;
      callback(coordinates);
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors du géocodage :', error);
    });
}

// Fonction pour effectuer la requête d'itinéraire à l'API OpenRouteService
function rechercherItineraires(departCoordinates, arriveeCoordinates) {
  // Clé d'accès à l'API OpenRouteService (remplacez par votre propre clé)
  const apiKey = '5b3ce3597851110001cf624815dbf64ad38949df9bfca1525c2137c6';

  // URL de l'API OpenRouteService
  const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${departCoordinates}&end=${arriveeCoordinates}`;

  // Effectuer la requête GET à l'API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Afficher la réponse de l'API dans la console du navigateur
      console.log(data);

      // Traiter la réponse de l'API et récupérer les itinéraires
      const itineraires = data.features.map(feature => {
        return {
          distance: feature.properties.summary.distance / 1000,
          duration: feature.properties.summary.duration,
          instructions: feature.properties.segments[0].steps.map(step => step.instruction)
        };
      });

          // Sélectionner l'élément où afficher les résultats
      const resultatContainer = document.getElementById('resultats');

      // Effacer les résultats précédents, le cas échéant
      resultatContainer.innerHTML = '';

      itineraires.forEach((itineraire, index) => {
        const resultat = document.createElement('div');
        resultat.classList.add('resultat');

        const titre = document.createElement('h3');
        titre.textContent = `Itinéraire ${index + 1}`;

        const distance = document.createElement('p');
        
distance.textContent = `Distance : ${itineraire.distance} km`;

        const duree = document.createElement('p');
        const durationHours = Math.floor(itineraire.duration / 3600);
        const durationMinutes = Math.floor((itineraire.duration % 3600) / 60);
        duree.textContent = `Durée : ${durationHours} heures ${durationMinutes} minutes`;

        resultat.appendChild(titre);
        resultat.appendChild(distance);
        resultat.appendChild(duree);

        resultatContainer.appendChild(resultat);
      });
    });
}

