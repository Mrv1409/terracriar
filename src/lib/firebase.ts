import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBdAMlFU7cwYuKIjqVV9XKwxBYmEQgrA5U',
  authDomain: 'terracriar-app.firebaseapp.com',
  projectId: 'terracriar-app',
  storageBucket: 'terracriar-app.firebasestorage.app',
  messagingSenderId: '541167908491',
  appId: '1:541167908491:web:c58eb6695e152102b0068e'
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;