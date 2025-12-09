importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDtkhCtMuXNAYlY_Sr39PouNRV9Qo-vIVU",
  authDomain: "rowanapp-7f560.firebaseapp.com",
  projectId: "rowanapp-7f560",
  storageBucket: "rowanapp-7f560.firebasestorage.app",
  messagingSenderId: "834001430294",
  appId: "1:834001430294:web:3d6283600e3a7920fc1237"
});

const messaging = firebase.messaging();

// Manejar notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificación recibida:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-72x72.png' // Asegúrate de tener un ícono ahí o usa uno de RowanIcon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});