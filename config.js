// Datos de conexión de Firebase. No son secretos: la seguridad está en las reglas de Firestore (firestore.rules).
window.CUADERNO_CONFIG = {
  firebase: {
    apiKey: "AIzaSyA-TpTC6GGnRWuCvb8AIOlbg8kJQNdfE5I",
    authDomain: "cuardeno-fincas.firebaseapp.com",
    projectId: "cuardeno-fincas",
    storageBucket: "cuardeno-fincas.firebasestorage.app",
    messagingSenderId: "883156603219",
    appId: "1:883156603219:web:03cd92e7f62bd7dee111a6",
  },
  // Correos que entran como administradores (deben coincidir con firestore.rules).
  administradores: ["luisbalza97@gmail.com", "agrobalza@gmail.com"],
  // Correo de bienvenida con la marca (EmailJS). Vacío = se usa el correo genérico de Firebase.
  emailjs: { serviceId: "service_rrgevj9", templateId: "template_l34zo99", publicKey: "DvKRF37AJxMxqNuEm" },
};
