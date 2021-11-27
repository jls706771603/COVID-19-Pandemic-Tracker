const admin = require('firebase-admin')
const fs = require('fs');
const csv = require('csv-parser');
const state = require('./state.js');
const county = require('./county.js');
const serviceAccount = require("C:/Users/jam1o/Desktop/School/capstone/COVID-19-Pandemic-Tracker/pandemic-tracker-1b4e2-firebase-adminsdk-ipzms-eaf218ffd1.json");


//Initialize Firebase App
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pandemic-tracker-1b4e2-default-rtdb.firebaseio.com/"
});

//Array for CSV Data
var stateList = [];
var countyList = [];
//Database Variables
var db = admin.database()
var ref = db.ref()


//Read CSV and push to state data to array
var array = fs.readFileSync('states.csv').toString().split("\n");

//Split line to array and allocate to State object
for(i = 1;i < array.length - 1; i++){
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    var name = stringArray[1];
    var id = stringArray[2];
    var cases = stringArray[3];
    var deaths = stringArray[4];
    deaths = deaths.slice(0, deaths.length - 1);
    var holder = new state(name, date, id, cases, deaths);
    stateList.push(holder);
}

//Read CSV and push county data to array
var array = fs.readFileSync('counties.csv').toString().split("\n");

//Split line to array and allocate to County object
for(i = 1;i < array.length - 1; i++){
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    var name = stringArray[1];
    var stateName = stringArray[2];
    var id = stringArray[3];
    var cases = stringArray[4];
    var deaths = stringArray[5];
    deaths = deaths.slice(0, deaths.length - 1);
    var holder = new county(name, date, stateName, id, cases, deaths);
    countyList.push(holder);
    i++;
}

//Push lists to DB
const stateRef = ref.child('states');
stateRef.set({stateList})

const countyRef = ref.child('counties');
countyRef.set({countyList})





