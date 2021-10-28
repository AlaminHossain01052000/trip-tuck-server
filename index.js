const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.li11u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    await client.connect();
    console.log("Client Connected")
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running")
})
app.get("/offers", (req, res) => {
    res.send("offer is running")
})
app.listen(port, () => {
    console.log("Listening to port", port)
})