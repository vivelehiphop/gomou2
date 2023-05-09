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

        const resultat = document.createElement('div');
        resultat.classList.add('resultat');

        const titre = document.createElement('h3');
        titre.textContent = nom;

        const tableau = document.createElement('table');
        tableau.classList.add('itineraire');

        const ligneMoyensLocomotionTitre = document.createElement('tr');
        const celluleMoyensLocomotionTitre = document.createElement('th');
        celluleMoyensLocomotionTitre.textContent = 'Moyen(s) de locomotion utilisé(s)';
                ligneMoyensLocomotionTitre.appendChild(celluleMoyensLocomotionTitre);
        tableau.appendChild(ligneMoyensLocomotionTitre);

        const ligneMoyensLocomotion = document.createElement('tr');
        const celluleMoyensLocomotion = document.createElement('td');
        celluleMoyensLocomotion.textContent = moyenVoyage;
        ligneMoyensLocomotion.appendChild(celluleMoyensLocomotion);
        tableau.appendChild(ligneMoyensLocomotion);

        const ligneDistanceTitre = document.createElement('tr');
        const celluleDistanceTitre = document.createElement('th');
        celluleDistanceTitre.textContent = 'Distance';
        ligneDistanceTitre.appendChild(celluleDistanceTitre);
        tableau.appendChild(ligneDistanceTitre);

        const ligneDistance = document.createElement('tr');
        const celluleDistance = document.createElement('td');
        celluleDistance.textContent = `${itineraire.distance} kilomètres`;
        ligneDistance.appendChild(celluleDistance);
        tableau.appendChild(ligneDistance);

        const ligneDurationTitre = document.createElement('tr');
        const celluleDurationTitre = document.createElement('th');
        celluleDurationTitre.textContent = 'Durée';
        ligneDurationTitre.appendChild(celluleDurationTitre);
        tableau.appendChild(ligneDurationTitre);

        const ligneDuration = document.createElement('tr');
        const celluleDuration = document.createElement('td');
        const durationHours = Math.floor(itineraire.duration / 3600);
        const durationMinutes = Math.floor((itineraire.duration % 3600) / 60);
        celluleDuration.textContent = `${durationHours} heures ${durationMinutes} minutes`;
        ligneDuration.appendChild(celluleDuration);
        tableau.appendChild(ligneDuration);

        const ligneEmpreinteCarboneTitre = document.createElement('tr');
        const celluleEmpreinteCarboneTitre = document.createElement('th');
        celluleEmpreinteCarboneTitre.textContent = 'Empreinte carbone';
        ligneEmpreinteCarboneTitre.appendChild(celluleEmpreinteCarboneTitre);
        tableau.appendChild(ligneEmpreinteCarboneTitre);

        const ligneEmpreinteCarbone = document.createElement('tr');
        const celluleEmpreinteCarbone = document.createElement('td');
        celluleEmpreinteCarbone.textContent = `${empreinteCarbone} kgCO2`;
        ligneEmpreinteCarbone.appendChild(celluleEmpreinteCarbone);
        tableau.appendChild(ligneEmpreinteCarbone);

        const lignePartQuotaTransportTitre = document.createElement('tr');
        const cellulePartQuotaTransportTitre = document.createElement('th');
        cellulePartQuotaTransportTitre.textContent = 'Part du quota transport annuel';
        lignePartQuotaTransportTitre.appendChild(cellulePartQuotaTransportTitre);
        tableau.appendChild(lignePartQuotaTransportTitre);

        const lignePartQuotaTransport = document.createElement('tr');
        const cellulePartQuotaTransport = document.createElement('td');
        cellulePartQuotaTransport.textContent = `${partQuotaTransport.toFixed(2)}%`;
        lignePartQuotaTransport.appendChild(cellulePartQuotaTransport);
        tableau.appendChild(lignePartQuotaTransport);

        resultat.appendChild(titre);
        resultat.appendChild(tableau);

        resultatContainer.appendChild(resultat);
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la recherche d\'itinéraires :', error);
      });
  });
}

