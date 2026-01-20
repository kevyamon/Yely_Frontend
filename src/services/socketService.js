// src/services/socketService.js
import { io } from 'socket.io-client';

// Utilise l'URL définie dans .env si elle existe, sinon localhost
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  socket = null;

  connect(token) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      auth: { token }, // On passe le token pour l'authentification
      transports: ['websocket'], // Performance maximale
      reconnection: true,
    });

    this.socket.on('connect', () => {
      console.log('⚡ Connecté au réseau Yély');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Déconnecté du réseau Yély');
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Erreur connexion socket:', err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Pour écouter un événement (ex: 'newRideAvailable')
  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  // Pour arrêter d'écouter
  off(eventName) {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }

  // Pour envoyer une action (ex: 'joinZone')
  emit(eventName, data) {
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  }
}

const socketService = new SocketService();
export default socketService;