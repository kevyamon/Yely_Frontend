// src/services/mapService.js
import axios from 'axios';

// API PHOTON (Plus rapide, tolérant et conçu pour l'autocomplétion)
const API_URL = 'https://photon.komoot.io/api/';

export const searchPlaces = async (query) => {
  if (!query || query.length < 3) return [];

  try {
    const response = await axios.get(API_URL, {
      params: {
        q: query,
        limit: 5,
        lat: 5.349390, // Latitude Abidjan (On centre la recherche ici pour prioriser la CI)
        lon: -4.017050, // Longitude Abidjan
        lang: 'fr' // Force les résultats en français
      }
    });

    // Photon renvoie du GeoJSON. On transforme ça en format simple pour notre app.
    return response.data.features.map(feature => {
        const props = feature.properties;
        return {
            place_id: props.osm_id,
            // On construit un titre intelligent (Nom du lieu OU Rue)
            main_text: props.name || props.street || props.city, 
            // On construit une description (Ville, Pays)
            secondary_text: [props.city, props.state, "Côte d'Ivoire"].filter(Boolean).join(', '),
            // Photon inverse Lat/Lon par rapport à Leaflet, on remet dans l'ordre
            lat: feature.geometry.coordinates[1], 
            lon: feature.geometry.coordinates[0]
        };
    });

  } catch (error) {
    console.error("Erreur API Map (Photon) :", error);
    return [];
  }
};