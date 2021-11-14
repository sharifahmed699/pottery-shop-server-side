const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, Collection } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s17ux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('potteryDB');
        const ProductCollection = database.collection("Products")
        const orderCollection = database.collection("Orders")
        const userCollection = database.collection('users');
        const reviewCollection = database.collection('reviews');

        //GET API for fetch data
        app.get('/products', async (req, res) => {
            const cursor = ProductCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        //POST API for add product
        app.post('/products', async (req, res) => {
            const product = req.body
            console.log(product)
            const result = await ProductCollection.insertOne(product)
            res.json(result)

        })
        //get single product item by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await ProductCollection.findOne(query)
            res.json(result)
        })
        // Delete API for product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await ProductCollection.deleteOne(query)
            res.json(result)

        })
        // GET API for order fetch all order
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        // POST API for order a product
        app.post('/order', async (req, res) => {
            const order = req.body;
            order.status = "Pending"
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        //get my order item using email
        app.post('/order/userId', async (req, res) => {
            const specificUser = req.body
            const query = { email: { $in: specificUser } }
            const specificUserBooking = await orderCollection.find(query).toArray()
            res.send(specificUserBooking);
        })
        //UPDATE API
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        // Delete API for my order item
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query)
            res.json(result)

        })
        // GET API for all user review item
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        // POST API for user review
        app.post('/review', async (req, res) => {
            const order = req.body;
            const result = await reviewCollection.insertOne(order);
            res.json(result);
        })
        // GET API for All user 
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        //POST API for add user 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        //find which user are adnin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

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