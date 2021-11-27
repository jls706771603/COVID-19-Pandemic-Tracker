
import firebase from 'firebase-admin'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig = {
    apiKey: "AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc",
    authDomain: "pandemic-tracker-1b4e2.firebaseapp.com",
    databaseURL: "https://pandemic-tracker-1b4e2-default-rtdb.firebaseio.com",
    projectId: "pandemic-tracker-1b4e2",
    storageBucket: "pandemic-tracker-1b4e2.appspot.com",
    messagingSenderId: "755928698748",
    appId: "1:755928698748:web:ecb56541688d390c905ef9",
    measurementId: "G-EZCGYK8FM2"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();

  export default db;