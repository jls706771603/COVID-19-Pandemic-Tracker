const fs = require('fs')
const https = require('https')

function downloadCSV(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);
        });
    }).on('error', function (err) {
        fs.unlink(dest);
        if (cb) cb(err.message);
    });
};

// replace your destination 'dest' with the new folder directory
const dest1  = './us.csv'
const dest2  = './us-states.csv'
const dest3  = './us-counties.csv'
const dest4 = './us-alltimedata.csv'
const urlUSA = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us.csv'
const urlStates = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-states.csv'
const urlCounties = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv'
const urlAllTimeData = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv'

// downloading each .csv individually using the raw link
downloadCSV(urlUSA, dest1, function(){
    console.log('Downloading USA csv: Finished')
})
downloadCSV(urlStates, dest2, function(){
    console.log('Downloading States csv: Finished')
})
downloadCSV(urlCounties, dest3, function(){
    console.log('Downloading Counties csv: Finished')
})
downloadCSV(urlAllTimeData, dest4, function(){
    console.log('Downloading All Time Data csv: Finished')
})