// app.js
const express = require('express');
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');

const uri = "mongodb+srv://admin:passwordnebula@nebuladb.d7wj5do.mongodb.net/test"; // Update with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
    try {
        await client.connect();
        const data = {
        

            "name": req.body.name,
            "role": req.body.role,
            "bio": req.body.bio,
            "gender": req.body.gender,
            "department": req.body.department,
            "college": req.body.college,
            // Add other data properties as needed
            "collectionName": String(Math.random()).substring(2) // Random collection name
        };

        const collection = client.db().collection(data.collectionName);
        await collection.insertOne(data);

        res.redirect(`/display/${data.collectionName}`);
    } finally {
        await client.close();
    }
});

app.get('/display/:collectionName', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db().collection(req.params.collectionName);
        const user = await collection.findOne();
        res.render('display', { user });
    } finally {
        await client.close();
    }
});

app.get('/edit/:collectionName', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db().collection(req.params.collectionName);
        const user = await collection.findOne();
        res.render('edit', { user });
    } finally {
        await client.close();
    }
});

app.post('/edit/:collectionName', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db().collection(req.params.collectionName);
        const updatedData = {
          

            "name": req.body.name,
            "role": req.body.role,
            "bio": req.body.bio,
            "gender": req.body.gender,
            "department": req.body.department,
            "college": req.body.college,
            // Add other updated data properties as needed
        };

        await collection.updateOne({}, { $set: updatedData });

        res.redirect(`/display/${req.params.collectionName}`);
    } finally {
        await client.close();
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
});

