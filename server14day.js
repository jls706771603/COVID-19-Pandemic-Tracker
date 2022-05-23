//This file gets todays date and then gets measured case rate data for all states at the 14 day, 3 month, and 6 month periods,
//then pushes data to RealtimeDatabase
const admin = require('firebase-admin')
const { performance } = require('perf_hooks');
const fs = require('fs');
const csv = require('csv-parser');
const usa = require('./usa.js')
const state = require('./state.js');
const county = require('./county.js');
const serviceAccount = require("C:/Users/jam1o/Desktop/School/capstone/COVID-19-Pandemic-Tracker/pandemic-tracker-1b4e2-firebase-adminsdk-ipzms-508f13aea2.json");
const { REFUSED } = require('dns');


let todaysData = []
let twoWeekData = []
let threeMonthData = []
let sixMonthData = []
//Initialize Firebase App
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pandemic-tracker-1b4e2-default-rtdb.firebaseio.com/"
  });

var db = admin.database()
var ref = db.ref()

//gets date from date passed along with the number of days previous requested
function getTwoWeeksPast(date, daysPast){
        var newDate = new Date()
        newDate.setDate(newDate.getDate()-daysPast)
        var dd = String(newDate.getDate()).padStart(2, '0')
        var mm = String(newDate.getMonth() + 1).padStart(2, '0')
        var yyyy = newDate.getFullYear() 
        newDate = yyyy + '-' + mm + '-' + dd
        return newDate
}

//finds matching record in second array
function findData(stateName){
    for(let i = 0; i < todaysData.length; i++){
        if(todaysData[i].name === stateName){
            // console.log("Returning Todays Data For Calc: " + todaysData[i])
            return todaysData[i]
            break
        }
    }
}
//get todays date
var today = new Date()
today.setDate(today.getDate()-1)
var dd = String(today.getDate()).padStart(2, '0')
var mm = String(today.getMonth() + 1).padStart(2, '0'); 
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd


var array = fs.readFileSync('states.csv').toString().split("\n");

var statePopArray = fs.readFileSync('statePopulation.csv').toString().split("\n");

//Split line to array and allocate to State object
for(i = (array.length-65);i < array.length; i++){
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    if(today === date){
        var name = stringArray[1];
        var id = stringArray[2];
        var cases = stringArray[3];
        var deaths = stringArray[4];
        if(deaths.includes('\r')){
            deaths = deaths.replace('\r', '')
        }
        var population = 0;
        var vacRate = 0;
        var holder = new state(name, date, id, cases, deaths, population, vacRate); 
        todaysData.push(holder);
    }
}
console.log(todaysData)
console.log(array.length)
console.log(array.length/2)
// Gets 14 Day Data
for(i = (Math.round(array.length/2)); i < array.length; i++) {
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    prevDate = getTwoWeeksPast(today, 14)
    if(prevDate === date){
        let todaysState = findData(stringArray[1])
        var name = stringArray[1];
        var id = stringArray[2];
        var cases = todaysState.cases - stringArray[3];
        var deaths = todaysState.deaths - stringArray[4];
        // deaths = deaths.slice(0, deaths.length - 1)
        var population = 0;
        var vacRate = 0;
        var holder = new state(name, date, id, cases, deaths, population, vacRate); 
        console.log("TodaysState Cases 14 days: " + todaysState.cases)
        console.log("Holder Cases 14 days: " + holder.cases) 
        console.log("Holder Deaths 14 days: " + holder.deaths)
        twoWeekData.push(holder)
    }

}

let allTwoWeekData = []
//Get All Data for Past 2 Weeks
let startSpot
for(i = 0; i < array.length; i++) {
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    prevDate = getTwoWeeksPast(today, 14)
    // console.log("Prevdate: " + prevDate + "'date' : " + date)
    if(prevDate === date){
        startSpot = i
        console.log("Starting Spot: " + startSpot)
        break;
    }
}
for(i = startSpot; i < array.length; i++) {
    let holder = []
    var stringArray = array[i].toString().split(',');
    console.log(stringArray)
    var holderDate = stringArray[0];
    let dateSame = true
    while (dateSame === true){
        let counter = 0
        for(let j = i; j < array.length; j++){
            var stringArray = array[j].toString().split(',');
            var date = stringArray[0]
            if (date !== holderDate){
                dateSame = false
            }
            var name = stringArray[1];
            var id = stringArray[2];
            var cases = stringArray[3];
            var deaths = stringArray[4];
            if(deaths.includes('\r')){
                deaths = deaths.replace('\r', '')
            }
            var population = 0;
            var vacRate = 0;
            var stateHolder = new state(name, date, id, cases, deaths, population, vacRate);
            holder.push(stateHolder)
            i += j
        }
    }
    allTwoWeekData.push(holder)
}    

// Gets 3 Month Data
for(i = (Math.round(array.length/2)); i < array.length; i++) {
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    prevDate = getTwoWeeksPast(today, 90)
    // console.log("Prevdate: " + prevDate + "'date' : " + date)
    if(prevDate === date){
        let todaysState = findData(stringArray[1])
        var name = stringArray[1];
        var id = stringArray[2];
        var cases = todaysState.cases - stringArray[3];
        var deaths = todaysState.deaths - stringArray[4];
        // deaths = deaths.slice(0, deaths.length - 1)
        var population = 0;
        var vacRate = 0;
        var holder = new state(name, date, id, cases, deaths, population, vacRate); 
        // console.log("TodaysState Cases 90 days: " + todaysState.cases)
        // console.log("Holder Deaths 90 days: " + holder.deaths) 
        threeMonthData.push(holder)
    }

}

//Gets 6 Month Data
for(i = (Math.round(array.length/3)); i < array.length; i++) {
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    prevDate = getTwoWeeksPast(today, 180)
    // console.log("Prevdate: " + prevDate + "'date' : " + date)
    if(prevDate === date){
        let todaysState = findData(stringArray[1])
        var name = stringArray[1];
        var id = stringArray[2];
        var cases = todaysState.cases - stringArray[3];
        var deaths = todaysState.deaths - stringArray[4];
        // deaths = deaths.slice(0, deaths.length - 1)
        var population = 0;
        var vacRate = 0;
        var holder = new state(name, date, id, cases, deaths, population, vacRate); 
        // console.log("TodaysState Cases 180 days: " + todaysState.cases)
        // console.log("Holder Deaths 180 days: " + holder.deaths) 
        sixMonthData.push(holder)
    }

}

//Adds population Data to Files
var array = fs.readFileSync('statePopulation.csv').toString().split("\n");
for(i = 1; i < array.length - 1; i++){
  var stringArray = array[i].toString().split(',');
  var popName = stringArray[2];
  var population = stringArray[3];
  for(j = 0; j < sixMonthData.length; j++){
    var currState = sixMonthData[j];
    if(currState.name == popName) {
      currState.population = population.slice(0, -1);
    }
  }
}
for(i = 1; i < array.length - 1; i++){
    var stringArray = array[i].toString().split(',');
    var popName = stringArray[2];
    var population = stringArray[3];
    for(j = 0; j < threeMonthData.length; j++){
      var currState = threeMonthData[j];
      if(currState.name == popName) {
        currState.population = population.slice(0, -1);
      }
    }
  }
for(i = 1; i < array.length - 1; i++){
var stringArray = array[i].toString().split(',');
var popName = stringArray[2];
var population = stringArray[3];
for(j = 0; j < twoWeekData.length; j++){
    var currState = twoWeekData[j];
    if(currState.name == popName) {
    currState.population = population.slice(0, -1);
        }
    }
}
// ADDS VACCINATION RATE TO EACH REF
//Parse state vaccination file and append population to matching county object
var array = fs.readFileSync('statesVaccination.csv').toString().split("\n");
for(i = 1; i < array.length - 1; i++){
  var stringArray = array[i].toString().split(',');
  var stateName = stringArray[0]
  var vacRate = stringArray[13]
  var oneDoseRate = stringArray[9]
  var fivePlusRate = stringArray[57]
  var plusRate18 = stringArray[15]
  var plusRate65 = stringArray[35]
  var plusBooster18 = stringArray[70]
  var plusBooster65 = stringArray[72]
  var fullyVacBoosterRate = stringArray[66]
  for(j = 0; j < twoWeekData.length; j++){
    var currState = twoWeekData[j];
    if(currState.name == stateName) {
      currState.vacRate = vacRate
      currState.oneDoseRate = oneDoseRate
      currState.fivePlusRate = fivePlusRate
      currState.plusRate18 = plusRate18
      currState.plusRate65 = plusRate65
      currState.plusBooster18 = plusBooster18
      currState.plusBooster65 = plusBooster65
      currState.fullyVacBoosterRate = fullyVacBoosterRate
    }
  }
}
var array = fs.readFileSync('statesVaccination.csv').toString().split("\n");
for(i = 1; i < array.length - 1; i++){
  var stringArray = array[i].toString().split(',');
  var stateName = stringArray[0]
  var vacRate = stringArray[13]
  var oneDoseRate = stringArray[9]
  var fivePlusRate = stringArray[57]
  var plusRate18 = stringArray[15]
  var plusRate65 = stringArray[35]
  var plusBooster18 = stringArray[70]
  var plusBooster65 = stringArray[72]
  var fullyVacBoosterRate = stringArray[66]
  for(j = 0; j < threeMonthData.length; j++){
    var currState = threeMonthData[j];
    if(currState.name == stateName) {
      currState.vacRate = vacRate
      currState.oneDoseRate = oneDoseRate
      currState.fivePlusRate = fivePlusRate
      currState.plusRate18 = plusRate18
      currState.plusRate65 = plusRate65
      currState.plusBooster18 = plusBooster18
      currState.plusBooster65 = plusBooster65
      currState.fullyVacBoosterRate = fullyVacBoosterRate
    }
  }
}
var array = fs.readFileSync('statesVaccination.csv').toString().split("\n");
for(i = 1; i < array.length - 1; i++){
  var stringArray = array[i].toString().split(',');
  var stateName = stringArray[0];
  var vacRate = stringArray[13];
  var oneDoseRate = stringArray[9]
  var fivePlusRate = stringArray[57]
  var plusRate18 = stringArray[15]
  var plusRate65 = stringArray[35]
  var plusBooster18 = stringArray[70]
  var plusBooster65 = stringArray[72]
  var fullyVacBoosterRate = stringArray[66]
  for(j = 0; j < sixMonthData.length; j++){
    var currState = sixMonthData[j];
    if(currState.name == stateName) {
      currState.vacRate = vacRate
      currState.oneDoseRate = oneDoseRate
      currState.fivePlusRate = fivePlusRate
      currState.plusRate18 = plusRate18
      currState.plusRate65 = plusRate65
      currState.plusBooster18 = plusBooster18
      currState.plusBooster65 = plusBooster65
      currState.fullyVacBoosterRate = fullyVacBoosterRate
    }
  }
}



console.log("Pushing Data")
//Push lists to DB
const twoWeekRef = ref.child('2 Week State Data');
twoWeekRef.set({twoWeekData})

const ninetyDayRef = ref.child('90 Day State Data');
ninetyDayRef.set({threeMonthData})

const sixMonthRef = ref.child('6 Month State Data');
sixMonthRef.set({sixMonthData})

const allTwoWeekRef = ref.child('All 2 Week Data')
for(let i = 0; i < allTwoWeekData.length; i++){
    let holder = allTwoWeekData[i]
    for(let j = 0; j < holder; j++){
        let holder2 = holder[j]
        let date = holder2.date
        console.log(date)
        allTwoWeekRef.child('All 2 Week Data').child({date}).push({holder2})
    }

}