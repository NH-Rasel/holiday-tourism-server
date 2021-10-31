const express = require('express');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djjiu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("holiday-tourism");
        const packageCollection = database.collection("packages");
        const userCollection = database.collection("user");

        //Get package API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const package = await cursor.toArray();
            res.send(package);
        });

        //Get single Package
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packageCollection.findOne(query);
            res.json(package);
        })
        app.get('/user', async (req, res) => {
            const cursor = userCollection.find({});
            const user = await cursor.toArray();
            res.send(user);
        });

        //Get single booking
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.json(user);
        })

        //POST package API
        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            console.log(result)
            res.json(result);

        })
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my server');
});

app.listen(port, () => {
    console.log('Running server on port', port);
});