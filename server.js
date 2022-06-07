const admin = require('firebase-admin')
const { performance } = require('perf_hooks');
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
var currDate = getDate().toString();
var pastDate = pastDate(14).toString();
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
var array = fs.readFileSync('alltimestates.csv').toString().split("\n");

var statePopArray = fs.readFileSync('statePopulation.csv').toString().split("\n");

//Split line to array and allocate to State object
for(i = 0;i < array.length; i++){
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
    console.log(holder)
    stateList.push(holder);
}

let dailyState = []
//Pushes Daily State Data
function dailyStateFunction(array){
  for(i = 0; i < array.length; i++){
    let obj = new Object
    let line = array[i].toString().split(',')
    obj.date = line[0]
    obj.name = line[1]
    obj.id = line[2]
    obj.cases = line[3]
    obj.deaths = line[4]
    deaths = deaths.slice(0, deaths.length - 1);
    console.log(obj.name)
    dailyState.push(obj)
  }
}

// function fullDailyStateFunction() {
//   var stateDailyArray = fs.readFileSync('stateDailyData.csv').toString().split("\n")
//   for(let i = 0; i < stateDailyArray.length - 1; i++){
//     let sameDate = true
//     let oneDayHolder = []
//     while(sameDate){
//       let line = stateDailyArray[i].toString().split(',')
//       console.log(line)
//       let currDate = line[0]
//       let nextLine = stateDailyArray[(i+1)].toString().split(',')
//       console.log(nextLine)
//       let nextDate = nextLine[0]
//       if(nextDate !== currDate){
//         console.log("Breaking Loop")
//         sameDate = false
//       } else {
//         oneDayHolder.push(stateDailyArray[i])
//         console.log(stateDailyArray[i])
//         break
//       } 
//     }
//     dailyStateFunction(oneDayHolder)
//   }
// }

// fullDailyStateFunction()

console.log(dailyState)
//Read CSV and push county data to array
var array = fs.readFileSync('counties.csv').toString().split("\n");

//Split line to array and allocate to County object
for(i = 0;i < array.length; i++){
    var stringArray = array[i].toString().split(',');
    var date = stringArray[0];
    var name = stringArray[1];
    var stateName = stringArray[2];
    var id = stringArray[3];
    var cases = stringArray[4];
    var deaths = stringArray[5];
    deaths = deaths.slice(0, deaths.length - 1);
    var population = 0;
    var recentDeaths = 0;
    var recentCases = 0;
    var holder = new county(name, date, stateName, id, cases, deaths, population, recentDeaths, recentCases);
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


// //Gets a value for date 14 days from today to use for recentCases and recentDeaths
// function priorDate() {
//   var d = new Date()
//   var x = 25;
//   d.setDate(d.getDate() - x);
//   let dd = String(d.getDate()).padStart(2, '0');
//   let mm = String(d.getMonth() + 1).padStart(2, '0');
//   let yyyy = d.getFullYear();
//   var today = yyyy + '-' + mm + '-' + dd;
//   return(today);
// }


//Adds County Populations To Data
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
  var stateName = stringArray[0]
  var vacRate = stringArray[13]
  var oneDoseRate = stringArray[9]
  var fivePlusRate = stringArray[57]
  var plusRate18 = stringArray[15]
  var plusRate65 = stringArray[35]
  var plusBooster18 = stringArray[70]
  var plusBooster65 = stringArray[72]
  var fullyVacBoosterRate = stringArray[66]
  for(j = 0; j < stateList.length; j++){
    var currState = stateList[j];
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


//Get 14 Day Case & Death Count
//Need to get a current time and a time 14 days prior and subtract the numbers
//For this county id in countyList, find x day and x day and subtract totals

// var array = fs.readFileSync('us-alltimedata.csv').toString().split("\n");

// //endpoint is last row of alltimedata file. midpoint is halfway through file
// var endpoint = array.length;
// var midpoint = Math.floor(endpoint/2);
// var foundRow = 0;

// //finds the first row of alltimedata file that matches pastDate
// function findSpot() {
//   let found = false;
//   console.log(midpoint);
//   let startRecord = midpoint
//   console.log("Initial Start Point:" + startRecord)
//   let array = fs.readFileSync('us-alltimedata.csv').toString().split("\n");
//   console.log("Finiding start")
//   while(found == false) {
//     let pastDateLine = array[startRecord].toString().split(',');
//     let prevPastDateLine = array[startRecord - 1].toString().split(',');
//     console.log(pastDateLine)
//     //If past date is lower than the date found in the returned record, move record forward 50%
//     if(pastDate > pastDateLine[0]){
//       //console.log("Going Down")
//       startRecord = Math.round((startRecord+endpoint)/2);
//     } else if (pastDate < pastDateLine[0]) { // If startRecord was too recent
//       //console.log("Going Up")
//       startRecord = Math.round(startRecord - 2800);
//     } if (pastDate === pastDateLine[0] && pastDate === prevPastDateLine[0]){ //If date found matches but is not the first record
//       //console.log("Close")
//       startRecord = startRecord - 1;
//     } if (pastDate === pastDateLine[0] && pastDate != prevPastDateLine[0]){ //If first record from the date is found
//       startRecord += 1
//       console.log("Found proper record: " + startRecord)
//       found = true;
//       }
//     }
//     return startRecord
// }

// //parses data from previous date to pass to findMatch
// function getRecentNumbers() {
//   //set iterator for past dates
//   let topIter = findSpot() -1
//   let array = fs.readFileSync('us-alltimedata.csv').toString().split("\n");
//   let keepGoing = true;
//   //loop through all dates matching the date 2 weeks from today
//   while (keepGoing === true){
//     let pastRow = array[topIter].toString().split(',')
//     let nextRow = array[topIter+1].toString().split(',')
//     console.log("pastRow date is: " + pastRow[0] + "and nextRow date is: " + nextRow[0])
//     //if next row has a different date, end of date in question is the current row, stop
//     if (pastRow[0] != nextRow[0]){
//       keepGoing = false
//     //else, pass current rows county ID, reported cases/deaths for this date to find match
//     } else {
//       console.log("topIter in loop is: " +  topIter)
//       findMatch(pastRow[3], pastRow[4], pastRow[5])
//       topIter = topIter+1
//     }
//   }
// }

// //finds match for the countyID passed to it from getRecentNumbers in todays date
// function findMatch(id, cases, deaths) {
//   let array = fs.readFileSync('us-alltimedata.csv').toString().split("\n");
//   let found = false
//   let counter = (endpoint - 3300)
//   let holder = array[counter].toString().split(',')
//   //begins looping through todays dates and looking for match to the county ID that was passed to it from today
//   while(found === false) {
//     //if the county ID on holder matches the ID passed to function, its a match. calculate cases/deaths and pass to update current
//     if(id === holder[3]){
//       recentCases = (holder[4] - cases)
//       recentDeaths = (holder[5] - deaths)
//       console.log("Matched, passing")
//       updateCurrent(holder[3], recentCases, recentDeaths)
//       found = true
//     //if counter = endpoint, reached end of file
//     } else if (counter === endpoint){
//       console.log("Record Not Found")
//       break;
//     } else {
//       counter = counter + 1
//       holder = array[counter].toString().split(',')
//     }
//   }
// }

//updates current cases & deaths on counties in countyList
function updateCurrent(id, cases, deaths){  
  for(i = 0; i < countyList.length; i++){
    let holder = countyList[i]
    if(holder.id.padStart(5, '0') === id){
      console.log("Set county: " + holder.name)
      holder.recentCases = cases
      holder.recentDeaths = deaths
      return;
    }
  }
}



//Finds county by matching passed ID to matching ID in countyList
function findCounty(pastID){
  for(i = 0; i < countyList.length; i++){
    let holder = countyList[i]
    if(holder.id === pastID) {
      console.log("holder" + holder.name)
      return holder
    }
  }
}

//Finds county passed to function and resets values
function setCounty(county) {
  for(i = 0; i < countyList.length; i++){
    if(county.id === countyList[i].id){
      countyList[i] == county
    }
  }
}

// //run getRecentNumbers to get updated case/death data for past 2 weeks
// getRecentNumbers()


console.log("Pushing Data")
//Push lists to DB
const usaRef = ref.child('usa');
usaRef.set({usaList})

const stateRef = ref.child('states');
stateRef.set({stateList})

const countyRef = ref.child('counties');
countyRef.set({countyList})

// for(let i = 0; i < dailyState.length; i++){
  
//   const dateRef = ref.child('dailyState')
//   console.log(dailyState[i].date)
//   dateRef.set({[dailyState[i].date]: dailyState})
// }






//Get Todays Date
function getDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return(today);
}


//Get x days ago date
function pastDate(number) {
  var d = new Date()
  d.setDate(d.getDate() - number);
  let dd = String(d.getDate()).padStart(2, '0');
  let mm = String(d.getMonth() + 1).padStart(2, '0');
  let yyyy = d.getFullYear();
  var today = yyyy + '-' + mm + '-' + dd;
  return(today);
}