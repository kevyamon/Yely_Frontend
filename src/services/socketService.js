// src/services/socketService.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  socket = null;
  pendingListeners = [];

  // AJOUT CRITIQUE : Pour savoir si on est prêt
  get isConnected() {
    return this.socket && this.socket.connected;
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      if (!token) {
        console.warn('⚠️ [Socket] Pas de token. Connexion ignorée.');
        return resolve(null);
      }

      // Si déjà connecté, on rend la main tout de suite
      if (this.socket && (this.socket.connected || this.socket.connecting)) {
        return resolve(this.socket);
      }

      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('🟢 [Socket] Connecté avec succès ! (ID:', this.socket.id, ')');
        this._flushPendingListeners();
        resolve(this.socket);
      });

      this.socket.on('connect_error', (err) => {
        console.error('🔴 [Socket] Erreur silencieuse:', err.message);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      if (this.socket.connected) {
        this.socket.disconnect();
      }
      this.socket = null;
      console.log('👋 [Socket] Déconnecté.');
    }
  }

  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    } else {
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

  // BLINDAGE DE L'ENVOI
  emit(eventName, data) {
    if (this.isConnected) {
      this.socket.emit(eventName, data);
    } else {
      console.warn(`⚠️ [Socket] Emit ignoré "${eventName}" : Socket pas encore prêt.`);
      // On ne plante pas, on prévient juste.
    }
  }

  _flushPendingListeners() {
    if (this.pendingListeners.length > 0) {
      this.pendingListeners.forEach(({ eventName, callback }) => {
        if (this.socket) this.socket.on(eventName, callback);
      });
      this.pendingListeners = [];
    }
  }
}

const socketService = new SocketService();
export default socketService;