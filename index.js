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
        const blogCollection = database.collection("blogs");

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
        //GET  booking API
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
        //GET blog API
        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find({});
            const blog = await cursor.toArray();
            res.send(blog);
        })

        //POST package API
        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            console.log(result)
            res.json(result);

        })
        //POST user API
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log(result);
            res.json(result);
        })
        //POST blog API
        app.post('/blogs', async (req, res) => {
            const newBlog = req.body;
            const result = await blogCollection.insertOne(newBlog);
            console.log(result);
            res.json(result);
        })
        //DELETE API
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.json(result);
        })
        //Update API
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateBooking.status
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
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