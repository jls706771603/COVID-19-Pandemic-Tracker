const admin = require('firebase-admin')
const fs = require('fs');
const csv = require('csv-parser');
const usa = require('./usa.js')
const state = require('./state.js');
const county = require('./county.js');
const serviceAccount = require("C:/Users/jam1o/Desktop/School/capstone/COVID-19-Pandemic-Tracker/pandemic-tracker-1b4e2-firebase-adminsdk-ipzms-508f13aea2.json");


//Initialize Firebase App
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pandemic-tracker-1b4e2-default-rtdb.firebaseio.com/"
});


//Array for CSV Data
var usaList = [];
var stateList = [];
var countyList = [];
var totalDeaths = 0;
//Database Variables
var db = admin.database()
var ref = db.ref()


//Read CSV and push to usa data to array
var array = fs.readFileSync('us.csv').toString().split("\n");

//Split line to array and allocate to State object
for(i = 1;i < array.length - 1; i++){
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    var cases = stringArray[1];
    var deaths = stringArray[2];
    deaths = deaths.slice(0, deaths.length - 1);
    totalDeaths += deaths;
    var holder = new usa(date, cases, deaths);
    usaList.push(holder);
}


//Read CSV and push to state data to array
var array = fs.readFileSync('states.csv').toString().split("\n");

var statePopArray = fs.readFileSync('statePopulation.csv').toString().split("\n");

//Split line to array and allocate to State object
for(i = 1;i < array.length - 1; i++){
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    var name = stringArray[1];
    var id = stringArray[2];
    var cases = stringArray[3];
    var deaths = stringArray[4];
    deaths = deaths.slice(0, deaths.length - 1);
    var population = 0;
    var vacRate = 0;
    var holder = new state(name, date, id, cases, deaths, population, vacRate);
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
    var population = 0;
    var holder = new county(name, date, stateName, id, cases, deaths, population);
    countyList.push(holder);
}


//Parse state population file and append population to matching county object

var array = fs.readFileSync('statePopulation.csv').toString().split("\n");
for(i = 1; i < array.length - 1; i++){
  var stringArray = array[i].toString().split(',');
  var popName = stringArray[2];
  var population = stringArray[3];
  for(j = 0; j < stateList.length; j++){
    var currState = stateList[j];
    if(currState.name == popName) {
      currState.population = population.slice(0, -1);
    }
  }
}
//Parse county population file and append population to matching county object

var array = fs.readFileSync('countyPopulation.csv').toString().split("\n");
for(i = 1; i < array.length - 1; i++){
  var stringArray = array[i].toString().split(',');
  var popID = stringArray[0];
  var population = stringArray[4];
  for(j = 0; j < countyList.length; j++){
    var currCounty = countyList[j];
    if(currCounty.id == popID) {
      currCounty.population = population.slice(0, -1);
    }
  }
}

//Parse state vaccination file and append population to matching county object

var array = fs.readFileSync('statesVaccination.csv').toString().split("\n");
for(i = 1; i < array.length - 1; i++){
  var stringArray = array[i].toString().split(',');
  var stateName = stringArray[0];
  var vacRate = stringArray[1];
  for(j = 0; j < stateList.length; j++){
    var currState = stateList[j];
    if(currState.name == stateName) {
      currState.vacRate = vacRate.slice(0, -1);
    }
  }
}

//Push lists to DB
const usaRef = ref.child('usa');
usaRef.set({usaList})

const stateRef = ref.child('states');
stateRef.set({stateList})

const countyRef = ref.child('counties');
countyRef.set({countyList})


