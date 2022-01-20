const axios = require('axios'); 
const fs = require('fs');

axios({
    method: "get",
    url: "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv",
    responseType: "stream"
}).then(function (response) {
    response.data.pipe(fs.createWriteStream("temp.csv"));
});

//axios.get('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv').then(({ data }) => console.log(data));

/*
writeToCSVFile(responseType);

function writeToCSVFile(data) {
    const filename = 'output.csv';
    fs.writeFile(filename, data, err => {
        if (err) {
            console.log('Error writing to csv file', err);
        } 
        else {
            console.log(`saved as ${filename}`);
        }
    });
}
*/