const fs = require('fs');
const express = require('express'); 

const PORT = process.env.PORT || 3001;

const app = express(); 


// get route should return notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// get route should return index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// get API route should read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'uft8', (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            const savedNotes = JSON.parse(data); 
        }
    })
})

//initializes the port
app.listen(PORT, () => {
    console.log(`Server is running now on port ${PORT}`);
});