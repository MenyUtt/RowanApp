export const environment = {
  production: true,
  // IMPORTANTE: Si vas a probar en el celular, pon aquí tu IP de red local (ej: 192.168.1.50)
  // Si dejas localhost, la app en el celular intentará conectarse a sí misma y fallará.
  apiUrl: 'http://192.168.1.78:3000',
  firebase: {
    apiKey: "AIzaSyDtkhCtMuXNAYlY_Sr39PouNRV9Qo-vIVU",
    authDomain: "rowanapp-7f560.firebaseapp.com",
    projectId: "rowanapp-7f560",
    storageBucket: "rowanapp-7f560.firebasestorage.app",
    messagingSenderId: "834001430294",
    appId: "1:834001430294:web:3d6283600e3a7920fc1237"
  },
  vapidKey: "BAmqvEoXs9sNiPWl5ra0A243vXqsihOXzfQZIMJYPcE1323Hj9KyajehMp9LW7c9hweMkHy1WpGZvPcLD1at8A8"
};