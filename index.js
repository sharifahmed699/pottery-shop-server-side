const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, Collection } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s17ux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("database connect succesfully")

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello  Server side assignment 12!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})