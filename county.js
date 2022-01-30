//County objects to store county data from CSV

const { getPackedSettings } = require("http2");


class county {
   constructor(name, date, state, id, cases, deaths, population) {
       this.name = name;
       this.date = date;
       this.id= id;
       this.cases = cases;
       this.deaths = deaths;
       this.state = state;
       this.population = population;

   } 
}

county.prototype.setName = function(name) {
    this.name = name;
}
county.prototype.setdate = function(date) {
    this.date = date;
}

county.prototype.setCases = function(cases) {
    this.cases = cases;
}

county.prototype.setavgCases = function(avgCases) {
    this.avgCases = avgCases;
}
county.prototype.setMandate = function(mandate) {
    this.mandate = mandate;
}
county.prototype.setState = function(state) {
    this.state = state;
}

module.exports = county;