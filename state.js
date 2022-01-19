//State object to store state data from CSV

const { get } = require("http");
const { getPackedSettings } = require("http2");


class state {
   constructor(name, date, id, cases, deaths, population, vacRate) {
       this.name = name;
       this.date = date;
       this.id= id;
       this.cases = cases;
       this.deaths = deaths;
       this.population = population;
       this.vacRate = vacRate;
   } 
}


state.prototype.setName = function(name) {
    this.name = name;
}
state.prototype.setdate = function(date) {
    this.date = date;
}

state.prototype.setCases = function(cases) {
    this.cases = cases;
}

state.prototype.setavgCases = function(avgCases) {
    this.avgCases = avgCases;
}
state.prototype.setMandate = function(mandate) {
    this.mandate = mandate;
}
state.prototype.setPopulation = function(population) {
    this.population = population;
}
state.prototype.vacRate = function(vacRate) {
    this.vacRate = vacRate;
}

function setPopulation(state, population) {
    state.population = population;
}

module.exports = state;


state.prototype.setName = function(name) {
    this.name = name;
}

// get name() {
//     return this.name;
// }


