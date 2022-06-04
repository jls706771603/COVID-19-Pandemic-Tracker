import * as firebase from 'firebase/app'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBYSwVwuuWe4ZxZpoNuCXWKWfmZXqWh9Lc",
    authDomain: "pandemic-tracker-1b4e2.firebaseapp.com",
    databaseURL: "https://pandemic-tracker-1b4e2-default-rtdb.firebaseio.com",
    projectId: "pandemic-tracker-1b4e2",
    storageBucket: "pandemic-tracker-1b4e2.appspot.com",
    messagingSenderId: "755928698748",
    appId: "1:755928698748:web:ecb56541688d390c905ef9",
    measurementId: "G-EZCGYK8FM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;