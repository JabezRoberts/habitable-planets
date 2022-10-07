// Stream csv file data
const { parse } = require('csv-parse');

// Node's file system module import
const fs = require('fs');


const habitablePlanets = []


// create a function that filters out only those planets that are habitable. Do this by using the koi_disposition column that tells the current status of the planet
//it could be confirmed, false positive, etc
// planet must also have a stellar flux 'koi_insol' between 0.36 and 1.11 that of earth to be habitable
// the upper limit for a planet's size for it to be habitable is 1.6 times that of earth's size listed as 'koi_prad'

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] == 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

// Read our file
fs.createReadStream('kepler_data.csv')
.pipe(parse({
    comment: '#', // Parse file correctly by telling it the comment symbol is the #
    columns: true, // return each row as a JS object with key-value pairs rather than array of values
}))// connecting the two streams together - the readable srtream source to  a writable destination
// so the Kepler file is the source and the parse() function is the destination
.on('data', (data) => {
    if (isHabitablePlanet(data)) {
        habitablePlanets.push(data);
    }
})
.on('error', (err) => {
    console.log(err);
})
.on('end', () => {
    console.log(`${habitablePlanets.length} habitable planets were found!`);
    console.log(habitablePlanets.map((planet) => {
        return planet['kepler_name']   
    }))
});
//use .on to chain on different event handlers for different scenarios and results that could take place
// Now data is being read as raw buffers of bytes but now we want each piece of data in our stream to be parsed as an object
// where the name of the column is the key and the value in the column is the value 
// so we pipe the output of our function by using the .pipe() function



