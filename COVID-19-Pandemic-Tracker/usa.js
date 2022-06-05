//State object to store state data from CSV

const { getPackedSettings } = require("http2");


class usa {
   constructor(date, cases, deaths) {
       this.date = date;
       this.cases = cases;
       this.deaths = deaths;
   } 
}

usa.prototype.setdate = function(date) {
    this.date = date;
}

usa.prototype.setCases = function(cases) {
    this.cases = cases;
}

usa.prototype.setavgCases = function(avgCases) {
    this.avgCases = avgCases;
}
usa.prototype.setMandate = function(mandate) {
    this.mandate = mandate;
}

module.exports = usa;
