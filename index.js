const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const cors = require('cors')

const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}

//middleware

app.use(cors(corsConfig));
app.options("", cors(corsConfig))
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


    app.get('/toys', async (req, res) => {
      const email = req.query.email;
          let query = {};
          if (req.query?.email) {
              query = {sellerEmail: email}
          }
          const result = await toysCollection.find(query).toArray()
          res.send(result)
      })
    
    // toy search
    app.get('/toy', async (req, res) => {
      const name = req.query.name;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1; 
          let query = {};
      if (req.query?.name) {
            console.log(name)
              query = {name: { $regex: name, $options: 'i' } }
          }
          const result = await toysCollection.find(query).sort({price: sortDirection}).limit(20).toArray()
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
      const {name, availableQuantity, description, price, rating, subCategory} = req.body;
      const toy = {
        $set: {
          name: name,
          availableQuantity: availableQuantity,
          description: description,
          subCategory: subCategory,
          price: price.toFixed(2),
          rating: rating
        }
      }
      const filter = {_id: new ObjectId(id)}
      const result = await toysCollection.updateOne(filter, toy);
      res.send(result)
    })
    //delete a toy
    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query)
      res.send(result)
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