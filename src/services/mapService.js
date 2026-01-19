// src/services/mapService.js
import axios from 'axios';

const API_URL = 'https://photon.komoot.io/api/';

export const searchPlaces = async (query) => {
  if (!query || query.length < 3) return [];

  try {
    const response = await axios.get(API_URL, {
      params: {
        q: query,
        limit: 5,
        lat: 5.349390, 
        lon: -4.017050,
        lang: 'fr'
      }
    });

    return response.data.features.map(feature => {
        const props = feature.properties;
        return {
            place_id: props.osm_id,
            main_text: props.name || props.street || props.city, 
            secondary_text: [props.city, props.state, "Côte d'Ivoire"].filter(Boolean).join(', '),
            // SÉCURITÉ : On force le type Nombre pour éviter les bugs Leaflet
            lat: parseFloat(feature.geometry.coordinates[1]), 
            lon: parseFloat(feature.geometry.coordinates[0])
        };
    });

  } catch (error) {
    console.error("Erreur API Map (Photon) :", error);
    return [];
  }
};