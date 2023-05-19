const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const cors = require('cors')


//middleware

app.use(cors());
app.use(express.json());





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
      

      const toysCollection=client.db('EduToys').collection('toys')


      app.get('/toys', async(req, res) => {
          const result = await toysCollection.find().toArray()
          res.send(result)
      })
    
    // single toy details route
    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query)
      res.send(result)
    })

    // add a toy
    app.post('/toys', async (req, res) => {
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
      res.send(result);

    })

    // update a toy

    app.patch('/toy/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
    })


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