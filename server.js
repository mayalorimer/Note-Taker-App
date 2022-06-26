const fs = require('fs');
const express = require('express'); 
const path = require('path'); 

const PORT = process.env.PORT || 3001;

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

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
            const notes = JSON.parse(data);
            res.json(notes);
        }
    });
});

// API post route to recieve a new note and add it to the db.json
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'uft8', (err, data) => {
        if (err) {
            console.error(err); 
        }
        else {
            const notes = JSON.parse(data);
            const newNote = req.body;
            notes.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
                if (err) {
                    console.error(err);
                }
                else {
                    res.json(newNote); 
                }
            })
        }
    });
});

//initializes the port
app.listen(PORT, () => {
    console.log(`Server is running now on port ${PORT}`);
});