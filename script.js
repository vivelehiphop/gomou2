const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const villeDepart = document.getElementById('ville-depart').value;
  const villeArrivee = document.getElementById('ville-arrivee').value;

  geocoder(villeDepart, (departCoordinates) => {
    geocoder(villeArrivee, (arriveeCoordinates) => {
      rechercherItineraires(departCoordinates, arriveeCoordinates);
    });
  });
});

const correspondanceCO2 = {
  'driving-car': 0.12,           // Poids en CO2 par kilomètre pour la voiture
  'cycling-regular': 0.02,       // Poids en CO2 par kilomètre pour le vélo
  'foot-walking': 0,             // Poids en CO2 par kilomètre pour la marche (0 car il n'y a pas d'émission de CO2)
  'bus': 0.04,                   // Poids en CO2 par kilomètre pour le bus
  'train': 0.03,                 // Poids en CO2 par kilomètre pour le train
  'airplane': 0.2                // Poids en CO2 par kilomètre pour l'avion
};


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

function rechercherItineraires(villeDepart, villeArrivee) {
  const apiKey = '5b3ce3597851110001cf624815dbf64ad38949df9bfca1525c2137c6';
  const optionsVoyage = [
    { moyen: 'driving-car', couleur: 'blue', nom: 'Voiture' },
    { moyen: 'foot-walking', couleur: 'green', nom: 'Marche' },
	{ moyen: 'train', couleur: 'yellow', nom: 'train' },
    { moyen: 'bus', couleur: 'red', nom: 'bus' },
    { moyen: 'cycling-regular', couleur: 'orange', nom: 'Vélo' },
  ];
  const resultatContainer = document.getElementById('resultats');
  resultatContainer.innerHTML = '';

  const tableau = document.createElement('table');
  tableau.classList.add('itineraire');

  // Création des lignes du tableau
  const ligneTitres = document.createElement('tr');
  const celluleMoyensLocomotionTitre = document.createElement('th');
  celluleMoyensLocomotionTitre.textContent = 'Moyen(s) de locomotion utilisé(s)';
  ligneTitres.appendChild(celluleMoyensLocomotionTitre);
  const celluleDistanceTitre = document.createElement('th');
  celluleDistanceTitre.textContent = 'Distance';
  ligneTitres.appendChild(celluleDistanceTitre);
  const celluleDurationTitre = document.createElement('th');
  celluleDurationTitre.textContent = 'Durée';
  ligneTitres.appendChild(celluleDurationTitre);
  const celluleEmpreinteCarboneTitre = document.createElement('th');
  celluleEmpreinteCarboneTitre.textContent = 'Empreinte carbone';
  ligneTitres.appendChild(celluleEmpreinteCarboneTitre);
  const cellulePartQuotaTransportTitre = document.createElement('th');
  cellulePartQuotaTransportTitre.textContent = 'Part du quota transport annuel';
  ligneTitres.appendChild(cellulePartQuotaTransportTitre);
  tableau.appendChild(ligneTitres);

  optionsVoyage.forEach((option, index) => {
        const moyenVoyage = option.moyen;
    const couleur = option.couleur;
    const nom = option.nom;

    const apiUrl = `https://api.openrouteservice.org/v2/directions/${moyenVoyage}?api_key=${apiKey}&start=${villeDepart}&end=${villeArrivee}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const itineraire = {
          distance: (data.features[0].properties.summary.distance / 1000).toFixed(1),
          duration: data.features[0].properties.summary.duration,
          empreinteCarbone: 0
        };

      // Récupérer le poids en CO2 par kilomètre pour le moyen de locomotion actuel
const poidsCO2 = correspondanceCO2[moyenVoyage];

// Calculer l'empreinte carbone en multipliant le poids en CO2 par kilomètre par la distance
const empreinteCarbone = (itineraire.distance * poidsCO2).toFixed(2);

        const partQuotaTransport = (empreinteCarbone / 2000) * 100;

        // Création d'une ligne pour chaque itinéraire
        const ligneItineraire = document.createElement('tr');

        const celluleMoyensLocomotion = document.createElement('td');
        celluleMoyensLocomotion.textContent = moyenVoyage;
        ligneItineraire.appendChild(celluleMoyensLocomotion);

        const celluleDistance = document.createElement('td');
        celluleDistance.textContent = `${itineraire.distance} kilomètres`;
        ligneItineraire.appendChild(celluleDistance);

        const celluleDuration = document.createElement('td');
        const durationHours = Math.floor(itineraire.duration / 3600);
        const durationMinutes = Math.floor((itineraire.duration % 3600) / 60);
        celluleDuration.textContent = `${durationHours} heures ${durationMinutes} minutes`;
        ligneItineraire.appendChild(celluleDuration);

        const celluleEmpreinteCarbone = document.createElement('td');
        celluleEmpreinteCarbone.textContent = `${empreinteCarbone} kgCO2`;
        ligneItineraire.appendChild(celluleEmpreinteCarbone);

        const cellulePartQuotaTransport = document.createElement('td');
        cellulePartQuotaTransport.textContent = `${partQuotaTransport.toFixed(2)}%`;
        ligneItineraire.appendChild(cellulePartQuotaTransport);

        tableau.appendChild(ligneItineraire);

        if (index === optionsVoyage.length - 1) {
          // Ajout du tableau complet une fois toutes les itérations terminées
          const resultat = document.createElement('div');
          resultat.classList.add('resultat');
          const titre = document.createElement('h3');
          titre.textContent = 'Itinéraires';

          resultat.appendChild(titre);
          resultat.appendChild(tableau);

          resultatContainer.appendChild(resultat);
        }
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la recherche d\'itinéraires :', error);
      });
  });
}

