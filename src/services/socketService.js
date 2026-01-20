// src/services/socketService.js
import { io } from 'socket.io-client';

// 🟢 RETOUR AU STANDARD : On utilise la variable d'environnement .env
// Si pas de .env, on suppose localhost. C'est la bonne façon de faire.
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  socket = null;
  pendingListeners = [];

  connect(token) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
    });

    // 🔇 SILENCE RADIO : On ne logue que les vraies erreurs critiques
    this.socket.on('connect_error', (err) => {
      // Cette erreur s'affichera si ton serveur local est éteint ou si l'URL est mauvaise
      console.error('❌ Erreur Socket :', err.message);
    });

    // Application silencieuse des écouteurs qui attendaient
    if (this.pendingListeners.length > 0) {
        this.pendingListeners.forEach(({ eventName, callback }) => {
            this.socket.on(eventName, callback);
        });
        this.pendingListeners = [];
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    } else {
      // On met en attente discrètement
      this.pendingListeners.push({ eventName, callback });
    }
  }

  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    } else {
      this.pendingListeners = this.pendingListeners.filter(l => l.eventName !== eventName);
    }
  }

  emit(eventName, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(eventName, data);
    }
    // Si pas connecté, on ignore silencieusement pour ne pas spammer la console
  }
}

const socketService = new SocketService();
export default socketService;