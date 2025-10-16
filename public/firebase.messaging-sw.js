importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHl28Ewe69chRpyXc7vx0XdfL9Fu25EM8",
  authDomain: "next-ecommerce-61baa.firebaseapp.com",
  projectId: "next-ecommerce-61baa",
  storageBucket: "next-ecommerce-61baa.firebasestorage.app",
  messagingSenderId: "144942752837",
  appId: "1:144942752837:web:06783e8d7e13b705666f2c",
  measurementId: "G-HMTE0ZYS3C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);
  
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/logo.png",
    badge: "/badge.png",
    data: payload.data || {}, // Additional data
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click received.', event);
  event.notification.close();

  if (event.action === 'open') {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Notification dismissed
    console.log('Notification dismissed');
  } else {
    // Default action - open app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});