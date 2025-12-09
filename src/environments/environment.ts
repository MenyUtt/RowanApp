export const environment = {
  production: false,
  // Aquí pones tu IP. 
  // Si pruebas en el navegador de tu PC: usa 'http://localhost:3000'
  // Si pruebas en tu celular (Android/iOS): usa tu IP de red 'http://192.168.100.72:3000'
  apiUrl: 'http://localhost:3000',
  firebase: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
  },
  vapidKey: "BAmqvEoXs9sNiPWl5ra0A243vXqsihOXzfQZIMJYPcE1323Hj9KyajehMp9LW7c9hweMkHy1WpGZvPcLD1at8A8"
};