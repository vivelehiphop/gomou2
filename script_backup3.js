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
    { moyen: 'cycling-regular', couleur: 'orange', nom: 'Vélo' },
    { moyen: 'foot-walking', couleur: 'green', nom: 'Marche' },
  ];

  const resultatContainer = document.getElementById('resultats');
  resultatContainer.innerHTML = '';

  const tableau = document.createElement('table');
  tableau.classList.add('itineraire');

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

        const empreinteCarbone = (itineraire.distance * 0.251).toFixed(2);
        const partQuotaTransport = (empreinteCarbone / 2000) * 100;

        const ligne = document.createElement('tr');
        ligne.classList.add('resultat');

        const celluleMoyenLocomotion = document.createElement('td');
        celluleMoyenLocomotion.textContent = nom;

        const celluleDistance = document.createElement('td');
        celluleDistance.textContent = `${itineraire.distance} kilomètres`;

        const celluleDuration = document.createElement('td');
                const durationHours = Math.floor(itineraire.duration / 3600);
        const durationMinutes = Math.floor((itineraire.duration % 3600) / 60);
        celluleDuration.textContent = `${durationHours}h ${durationMinutes}min`;

        const celluleEmpreinteCarbone = document.createElement('td');
        celluleEmpreinteCarbone.textContent = `${empreinteCarbone} kgCO2`;

        const cellulePartQuotaTransport = document.createElement('td');
        cellulePartQuotaTransport.textContent = `${partQuotaTransport.toFixed(2)}%`;

        ligne.appendChild(celluleMoyenLocomotion);
        ligne.appendChild(celluleDistance);
        ligne.appendChild(celluleDuration);
        ligne.appendChild(celluleEmpreinteCarbone);
        ligne.appendChild(cellulePartQuotaTransport);

        tableau.appendChild(ligne);

        if (index === optionsVoyage.length - 1) {
          const titre = document.createElement('h3');
          titre.textContent = 'Itinéraires';

          resultatContainer.appendChild(titre);
          resultatContainer.appendChild(tableau);
        }
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la recherche d\'itinéraires :', error);
      });
  });
}

