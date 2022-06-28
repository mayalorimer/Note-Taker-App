const fs = require('fs');
const express = require('express'); 
const path = require('path'); 

//generating uniquie ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// get route should return notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// get API route should read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
     fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            res.json(JSON.parse(data));
        }
    }); 
/*     res.status(200).json(`${req.method} request recieved to get notes`);

    console.info(`${req.method} request recieved to get notes`); */
});

// API post route to recieve a new note and add it to the db.json
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body; 

    if (title && text) {
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };

        // obtain the existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            }
            else {
                const parsedNotes = JSON.parse(data); 

                // Add a new review 
                parsedNotes.push(newNote); 

                fs.writeFile( './db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => 
                    writeErr ? console.error(writeErr) : console.info("successfully added note!")
                );
            }
        });
        const response = {
            status: 'success',
            body: newNote,
        };
        
        console.log(response);
        res.status(201).json(response); 

    } else {
        res.status(500).json("Error in adding note"); 
    }




});


// get route should return index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//initializes the port
app.listen(PORT, () => {
    console.log(`Server is running now on port ${PORT}`);
});