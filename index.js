const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://trip-tuck:7sNdJlGKJnISbITs@cluster0.li11u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000, // Adjust the timeout values as needed
    socketTimeoutMS: 60000,
  });
  

async function run() {
    await client.connect();
    const database = client.db("trip_tuck");
    const offerCollection = database.collection("offers");
    const bookingCollection = database.collection("bookings");
    // get all offers
    app.get("/offers", async (req, res) => {
        const offers = await offerCollection.find({}).toArray();
        res.json(offers);
    })

    // add a new offer
    app.post("/offers", async (req, res) => {
        const newOffer = await offerCollection.insertOne(req.body);
        res.json(newOffer)
    })
    // get booked offers
    app.get("/bookings", async (req, res) => {
        const bookings = await bookingCollection.find({}).toArray();
        res.json(bookings);
    })
    // get all the booked offer of a particular user
    app.get("/bookings/:email", async (req, res) => {
        const query = { email: req.params.email }
        const bookedOffers = await bookingCollection.find(query).toArray();
        res.json(bookedOffers)
    })
    // get a particular booked offer using id
    app.put("/bookings/:id", async (req, res) => {

        const query = { _id: ObjectId(req.params.id) }
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                status: req.body.status
            },
        };
        const result = await bookingCollection.updateOne(query, updateDoc, options);
        res.json(result);

    })
    // deleting a offer from my bookings
    app.delete("/bookings/:id", async (req, res) => {
        const query = { _id: ObjectId(req.params.id) };
        const deletedOffer = await bookingCollection.deleteOne(query);
        res.json(deletedOffer);

    })
    // book a offer using crud post

    app.post("/bookings", async (req, res) => {
        console.log(req.body);
        const cursor = await bookingCollection.insertOne(req.body);
        res.json(cursor);
    })
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running")
})

app.listen(port, () => {
    console.log("Listening to port", port)
})
