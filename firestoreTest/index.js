const admin = require("firebase-admin");

const serviceAccount = require("E:\MyDocuments\firebase\serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pandemic-tracker-1b4e2-default-rtdb.firebaseio.com"
});

const db = admin.firestore();