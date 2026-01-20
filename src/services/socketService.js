// src/services/socketService.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  socket = null;
  pendingListeners = [];

  connect(token) {
    // Sécurité anti-doublon pour éviter les erreurs jaunes
    if (this.socket && (this.socket.connected || this.socket.connecting)) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5, // Limite les tentatives pour ne pas spammer
    });

    // On masque les erreurs dans la console (le navigateur peut encore en afficher en rouge si c'est critique, c'est inévitable)
    this.socket.on('connect_error', () => {
      // Silence radio sur les erreurs de connexion
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
      // On ne coupe que si c'est vraiment connecté pour éviter le warning "closed before established"
      if (this.socket.connected) {
        this.socket.disconnect();
      }
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
  }
}

const socketService = new SocketService();
export default socketService;