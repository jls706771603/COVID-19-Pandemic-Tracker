const axios = require('axios'); 
const fs = require('fs');

var logBackup = console.log;
var logMessages = [];

console.log = function() {
    logMessages.push.apply(logMessages, arguments);
    logBackup.apply(console, arguments);
};

axios.get('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv').then(({ data }) => console.log(data));
writeToCSVFile();

function writeToCSVFile() {
    const filename = 'output.csv';
    fs.writeFile(filename, logMessages.toString(), err => {
        if (err) {
            console.log('Error writing to csv file', err);
        } 
        else {
            console.log(`saved as ${filename}`);
        }
    });
}

console.log(logMessages.toString())