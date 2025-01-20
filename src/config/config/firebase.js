
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase desde tu consola de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBVNmLUnyFSuOjyqXVX65iYJOGFIbTyKiU",
    authDomain: "appt-eb36e.firebaseapp.com",
    projectId: "appt-eb36e",
    storageBucket: "appt-eb36e.firebasestorage.app",
    messagingSenderId: "524292192298",
    appId: "1:524292192298:web:11981e7a8ff59ca25deb53",
    measurementId: "G-GQV7VCD1Q8"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de autenticación
export const auth = getAuth(app);
