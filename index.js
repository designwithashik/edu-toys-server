const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const cors = require('cors')


//middleware

app.use(cors());
app.use(express.json());




console.log(process.env.USER_ID)

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.u1007ka.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      client.connect();
      

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// route startup

app.get('/', (req, res) => {
    res.send('Edu Toys is selling Educational Toys')
});
app.listen(port, () => {
    console.log(`The server is running on ${port}`)
})