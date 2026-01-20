// src/services/socketService.js
import { io } from 'socket.io-client';

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

    this.socket.on('connect_error', (err) => {
      // On garde juste les erreurs critiques de connexion
      // console.error('❌ Erreur Socket :', err.message); 
    });

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
    // Sinon, silence total (plus de warning jaune)
  }
}

const socketService = new SocketService();
export default socketService;