
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

/**/

// Fonction pour effectuer la requête d'itinéraire à l'API OpenRouteService
function rechercherItineraires(villeDepart, villeArrivee) {
  // Clé d'accès à l'API OpenRouteService (remplacez par votre propre clé)
  const apiKey = '5b3ce3597851110001cf624815dbf64ad38949df9bfca1525c2137c6';

  // Options de voyage
  const optionsVoyage = [
   // { moyen: 'driving-car', couleur: 'blue', nom: 'Voiture' },
    { moyen: 'cycling-regular', couleur: 'orange', nom: 'Vélo' },
    { moyen: 'foot-walking', couleur: 'green', nom: 'Marche' },
  ];

  // Sélectionner l'élément où afficher les résultats
  const resultatContainer = document.getElementById('resultats');

  // Effacer les résultats précédents, le cas échéant
  resultatContainer.innerHTML = '';

  // Parcourir chaque option de voyage
  optionsVoyage.forEach((option, index) => {
    const moyenVoyage = option.moyen;
    const couleur = option.couleur;
    const nom = option.nom;

    // Effectuer la requête d'itinéraire à l'API OpenRouteService
    // Utilisez l'option de voyage spécifiée dans l'URL de l'API
    const apiUrl = `https://api.openrouteservice.org/v2/directions/${moyenVoyage}?api_key=${apiKey}&start=${villeDepart}&end=${villeArrivee}`;

    // Effectuer la requête GET à l'API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Traiter la réponse de l'API et récupérer les détails de l'itinéraire
        const itineraire = {
          distance: (data.features[0].properties.summary.distance / 1000).toFixed(1), // Conversion de mètres en kilomètres avec un chiffre après la virgule
          duration: data.features[0].properties.summary.duration,
          empreinteCarbone: 0 // Valeur de l'empreinte carbone à calculer ultérieurement
        };

        // Calcul de l'empreinte carbone
        const empreinteCarbone = (itineraire.distance * 0.251).toFixed(2);

        // Calcul de la part du quota transport annuel en pourcentage
        const partQuotaTransport = (empreinteCarbone / 2000) * 100;

        // Création de l'élément conteneur du résultat
        const resultat = document.createElement('div');
        resultat.classList.add('resultat');

        // Création du titre de l'itinéraire
        const titre = document.createElement('h3');
        titre.textContent = nom;

        // Création du tableau contenant les détails de l'itinéraire
        const tableau = document.createElement('table');
        tableau.classList.add('itineraire');

                // Création des lignes du tableau
        const ligneMoyensLocomotion = document.createElement('tr');
        const celluleMoyensLocomotionTitre = document.createElement('th');
        celluleMoyensLocomotionTitre.textContent = 'Moyen(s) de locomotion utilisé(s)';
        const celluleMoyensLocomotion = document.createElement('td');
        celluleMoyensLocomotion.textContent = moyenVoyage;
        ligneMoyensLocomotion.appendChild(celluleMoyensLocomotionTitre);
        ligneMoyensLocomotion.appendChild(celluleMoyensLocomotion);

        const ligneDistance = document.createElement('tr');
        const celluleDistanceTitre = document.createElement('th');
        celluleDistanceTitre.textContent = 'Distance';
        const celluleDistance = document.createElement('td');
        celluleDistance.textContent = `${itineraire.distance} kilomètres`;
        ligneDistance.appendChild(celluleDistanceTitre);
        ligneDistance.appendChild(celluleDistance);

        const ligneDuration = document.createElement('tr');
        const celluleDurationTitre = document.createElement('th');
        celluleDurationTitre.textContent = 'Durée';
        const celluleDuration = document.createElement('td');
        const durationHours = Math.floor(itineraire.duration / 3600); // Calcul des heures
        const durationMinutes = Math.floor((itineraire.duration % 3600) / 60); // Calcul des minutes
        celluleDuration.textContent = `${durationHours}h ${durationMinutes}min`;
        ligneDuration.appendChild(celluleDurationTitre);
        ligneDuration.appendChild(celluleDuration);

        const ligneEmpreinteCarbone = document.createElement('tr');
        const celluleEmpreinteCarboneTitre = document.createElement('th');
        celluleEmpreinteCarboneTitre.textContent = 'Empreinte Carbone';
        const celluleEmpreinteCarbone = document.createElement('td');
        celluleEmpreinteCarbone.textContent = `${empreinteCarbone} kgCO2`;
        ligneEmpreinteCarbone.appendChild(celluleEmpreinteCarboneTitre);
        ligneEmpreinteCarbone.appendChild(celluleEmpreinteCarbone);

        const lignePartQuotaTransport = document.createElement('tr');
        const cellulePartQuotaTransportTitre = document.createElement('th');
        cellulePartQuotaTransportTitre.textContent = 'Part du quota transport annuel';
        const cellulePartQuotaTransport = document.createElement('td');
        cellulePartQuotaTransport.textContent = `${partQuotaTransport.toFixed(2)}%`;
        lignePartQuotaTransport.appendChild(cellulePartQuotaTransportTitre);
        lignePartQuotaTransport.appendChild(cellulePartQuotaTransport);

        // Ajout des lignes au tableau
        tableau.appendChild(ligneMoyensLocomotion);
        tableau.appendChild(ligneDistance);
        tableau.appendChild(ligneDuration);
        tableau.appendChild(ligneEmpreinteCarbone);
        tableau.appendChild(lignePartQuotaTransport);

        // Ajout du titre et du tableau à l'élément conteneur du résultat
        resultat.appendChild(titre);
        resultat.appendChild(tableau);

        // Ajout du résultat à l'élément conteneur des résultats
        resultatContainer.appendChild(resultat);
      });
  });
}
