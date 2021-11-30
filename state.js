//State object to store state data from CSV

const { getPackedSettings } = require("http2");


class state {
   constructor(name, date, id, cases, deaths) {
       this.name = name;
       this.date = date;
       this.id= id;
       this.cases = cases;
       this.deaths = deaths;
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

module.exports = state;


state.prototype.setName = function(name) {
    this.name = name;
}


