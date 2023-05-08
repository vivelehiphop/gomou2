// Sélectionner le formulaire de recherche
const searchForm = document.getElementById('search-form');

// Ajouter un gestionnaire d'événement pour l'événement "submit" du formulaire
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Empêcher le rechargement de la page

  // Récupérer les valeurs des champs de saisie
  const villeDepart = document.getElementById('ville-depart').value;
  const villeArrivee = document.getElementById('ville-arrivee').value;

  // Utiliser le géocodeur Mapbox pour convertir les adresses en coordonnées géographiques
  geocoder.query(villeDepart);
  geocoder.query(villeArrivee);
});

// Fonction pour effectuer la requête d'itinéraire à l'API OpenRouteService
function rechercherItineraires(villeDepart, villeArrivee) {
  // Clé d'accès à l'API OpenRouteService (remplacez par votre propre clé)
  const apiKey = '5b3ce3597851110001cf624815dbf64ad38949df9bfca1525c2137c6';

  // URL de l'API OpenRouteService
  const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${villeDepart}&end=${villeArrivee}`;

  // Effectuer la requête GET à l'API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Afficher la réponse de l'API dans la console du navigateur
      console.log(data);

      // Traiter la réponse de l'API et récupérer les itinéraires
      const itineraires = data.features.map(feature => {
        return {
          distance: feature.properties.summary.distance,
          duration: feature.properties.summary.duration,
          instructions: feature.properties.segments[0].steps.map(step => step.instruction)
        };
      });

      // Sélectionner l'élément où afficher les résultats
      const resultatContainer = document.getElementById('resultats');

      // Effacer les résultats précédents, le cas échéant
      resultatContainer.innerHTML = '';

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
    });
}

// Ajoutez le code de géocodage Mapbox ici
mapboxgl.accessToken = 'pk.eyJ1Ijoidml2ZWxlaGlwaG9wIiwiYSI6ImNsaGY3aWJtdTEzengzbXBjdGRuN2g5dmMifQ.bd1-dun6CWxBoQG006CgOw';

// Créer une instance du géocodeur Mapbox
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  placeholder: 'Entrez une adresse'
});

// Sélectionner les champs de saisie des villes
const villeDepartInput = document.getElementById('ville-depart');
const villeArriveeInput = document.getElementById('ville-arrivee');

// Ajouter un gestionnaire d'événement pour la sélection d'une adresse de départ
geocoder.on('result', function(event) {
  const result = event.result;
  const coordinates = result.geometry.coordinates;
  const longitude = coordinates[0];
  const latitude = coordinates[1];
  villeDepartInput.dataset.longitude = longitude;
  villeDepartInput.dataset.latitude = latitude;
});

// Ajouter un gestionnaire d'événement pour la sélection d'une adresse d'arrivée
geocoder.on('result', function(event) {
  const result = event.result;
  const coordinates = result.geometry.coordinates;
  const longitude = coordinates[0];
  const latitude = coordinates[1];
  villeArriveeInput.dataset.longitude = longitude;
  villeArriveeInput.dataset.latitude = latitude;
});

// Ajouter un gestionnaire d'événement pour le clic sur le bouton de recherche
document.getElementById('search-button').addEventListener('click', function() {
  const villeDepart = villeDepartInput.value;
  const villeArrivee = villeArriveeInput.value;
  const villeDepartLongitude = villeDepartInput.dataset.longitude;
  const villeDepartLatitude = villeDepartInput.dataset.latitude;
  const villeArriveeLongitude = villeArriveeInput.dataset.longitude;
  const villeArriveeLatitude = villeArriveeInput.dataset.latitude;

  // Vérifier si les coordonnées sont disponibles
  if (villeDepartLongitude && villeDepartLatitude && villeArriveeLongitude && villeArriveeLatitude) {
    // Appeler la fonction de recherche d'itinéraire avec les coordonnées des villes
    rechercherItineraires(villeDepartLongitude, villeDepartLatitude, villeArriveeLongitude, villeArriveeLatitude);
  } else {
    console.log('Veuillez sélectionner une adresse de départ et une adresse d\'arrivée.');
  }
});

// Fonction pour effectuer la requête d'itinéraire à l'API OpenRouteService
function rechercherItineraires(villeDepartLongitude, villeDepartLatitude, villeArriveeLongitude, villeArriveeLatitude) {
  // Clé d'accès à l'API OpenRouteService (remplacez par votre propre clé)
  const apiKey = '5b3ce3597851110001cf624815dbf64ad38949df9bfca1525c2137c6';

  // URL de l'API OpenRouteService avec les coordonnées des villes
  const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${villeDepartLongitude},${villeDepartLatitude}&end=${villeArriveeLongitude},${villeArriveeLatitude}`;

  // Effectuer la requête GET à l'API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Afficher la réponse de l'API dans la console du navigateur
      console.log(data);

      // Traiter la réponse de l'API et récupérer les itinéraires
      const itineraires = data.features.map(feature => {
        return {
          distance: feature.properties.summary.distance,
          duration: feature.properties.summary.duration,
          instructions: feature.properties.segments[0].steps.map(step => step.instruction)
        };
      });

      // Sélectionner l'élément où afficher les résultats
      const resultatContainer = document.getElementById('resultats');

      // Effacer les résultats précédents, le cas échéant
      resultatContainer.innerHTML = '';

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
      console.error('Une erreur s\'est produite lors de la requête :', error);
    });
}

