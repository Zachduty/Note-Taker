// Dependencies
const express = require('express');    // Import Express for Server Stuff
const path = require('path');          // Import Path Module for File Directory Work
const fs = require('fs');              // Import File System Module for Reading/Writing Files
const db = require('../db/db.json');   // Import db.json

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Check for Server Running
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));



// GET Notes Api
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, '../db/db.json')));

// GET Specific Note
app.get('/api/notes/:note', (req, res) => {
    // Chosen Note 
    const chosen = req.params.note;

    // for loop iteration, if selected note title is in db.json, response is json of that specific db entry
    for (let i = 0; i < db.length; i++) {
        if (chosen === db[i].title) {
          return res.json(db[i]);
        };
      };
});

// POST
app.post('/api/notes', (req, res) => {
    // New API note
    const newNote = req.body;

    // get data from db.json
    let dbData = fs.readFileSync(path.join(__dirname, '../db/db.json'));
    // parse dbData
    let parsedDbData = JSON.parse(dbData);
    // Push note to db.json with id number 
    newNote.id = verifyID(parsedDbData);
    parsedDbData.push(newNote);

    // Overwrite existing db.json
    fs.writeFile('./db/db.json', JSON.stringify(parsedDbData), err => {
        err ? console.error(err) : console.log('Successfully Saved Note');
    });
    // Reload the page on new note creation
    res.end();
});

// DELETE
app.delete('/api/notes/:id', (req, res) => {

    const returnId = req.params.id;

    // get data from db.json
    let dbData = fs.readFileSync(path.join(__dirname, '../db/db.json'));
    // parse dbData
    let parsedDbData = JSON.parse(dbData);

    for (let i = 0; i < parsedDbData.length; i++) {
        if (parsedDbData[i].id == returnId) {
            parsedDbData.splice(i, 1);
        };
    };

    // Overwrite existing db.json
    fs.writeFile('./db/db.json', JSON.stringify(parsedDbData), err => {
        err ? console.error(err) : console.log('Successfully Deleted Note');
    });

    res.end();

});

// Serve HTML Pages
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '../public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

// Function for giving each note a unique id
// If a note already has that id, the next id is checked until a unique id is found
function verifyID(parsedData) {
    let x = parsedData.length;
    if (x === 0) {
        x = 1
    }
    else {
        for (i = 0; i < parsedData.length; i++) {
            if (parsedData[i].id === x){
                x++;
            }
        
        }
    }
    return x
}