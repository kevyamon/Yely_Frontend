import { io } from 'socket.io-client';

// URL du backend (Local ou Production)
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  socket = null;
  pendingListeners = []; // 🧠 La liste d'attente (Mémoire tampon)

  connect(token) {
    if (this.socket) return;

    console.log("🔌 Initialisation du Socket...");
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
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

    // 🚀 ON APPLIQUE LES ÉCOUTEURS EN ATTENTE
    if (this.pendingListeners.length > 0) {
        console.log(`📥 Application de ${this.pendingListeners.length} écouteurs en attente...`);
        this.pendingListeners.forEach(({ eventName, callback }) => {
            this.socket.on(eventName, callback);
        });
        this.pendingListeners = []; // On vide la liste
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // --- ÉCOUTER (BLINDÉ) ---
  on(eventName, callback) {
    if (this.socket) {
      // Cas 1 : Déjà connecté, on branche direct
      this.socket.on(eventName, callback);
    } else {
      // Cas 2 : Pas encore connecté (Race Condition), on met en liste d'attente
      console.log(`⏳ Mise en attente de l'écouteur : ${eventName}`);
      this.pendingListeners.push({ eventName, callback });
    }
  }

  // --- ARRÊTER D'ÉCOUTER ---
  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    } else {
      // On retire aussi de la liste d'attente si ça n'a pas encore été branché
      this.pendingListeners = this.pendingListeners.filter(l => l.eventName !== eventName);
    }
  }

  // --- PARLER ---
  emit(eventName, data) {
    if (this.socket) {
      this.socket.emit(eventName, data);
    } else {
        console.warn(`⚠️ Tentative d'emit '${eventName}' sans connexion socket.`);
    }
  }
}

const socketService = new SocketService();
export default socketService;