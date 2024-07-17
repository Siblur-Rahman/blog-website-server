const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://assign-11-c79bf.web.app',
    'https://assign-11-c79bf.firebaseapp.com',
  ],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ts8x6gb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {
    const blogsCollection = client.db('farwahBlog').collection('blogs')
    const wishlistCollection = client.db('farwahBlog').collection('wishlist')
    //

    // Get all blogs data from db
    app.get('/blogs', async (req, res) => {
      const result = await blogsCollection.find().toArray()

      res.send(result)
    })

    // Get a single blog data from db using blog id
    app.get('/blog/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await blogsCollection.findOne(query)
      res.send(result)
    })
    //
    app.get('/recentblogs', async (req, res) => {
      const result = await blogsCollection.find().sort({_id: -1}).limit(6).toArray()
      res.send(result)
    })
    //
    //



    // Save a wishblog data in db
    app.post('/wishlist', async (req, res) => {
      const blogData = req.body

      const result = await wishlistCollection.insertOne(blogData)
      res.send(result)
    })

    // get all wishlist blogs by a specific user
    app.get('/wishlist/:email', async (req, res) => {
      const email = req.params.email
      const query = { 'blogger.email': email }
      // const query = { _id: new ObjectId(id) }
      const result = await wishlistCollection.find(query).toArray()
      res.send(result)
    })

    // Save a blog data in db
    app.post('/blog', async (req, res) => {
      const blogData = req.body
      const result = await blogsCollection.insertOne(blogData)
      res.send(result)
    })
    

    // get all blogs posted by a specific user
    app.get('/blogs/:email', async (req, res) => {
      const email = req.params.email

      const query = { 'blogger.email': email }
      const result = await blogsCollection.find(query).toArray()
      res.send(result)
    })
    // delete a blog data from db
    app.delete('/blog/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await blogsCollection.deleteOne(query)
      res.send(result)
    })
    // delete a wishlist blog data from db
    app.delete('/wishlist/:id', async (req, res) => {

      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await wishlistCollection.deleteOne(query)
      res.send(result)
    })

    // update a blog in db
    app.put('/blog/:id', async (req, res) => {
      const id = req.params.id
      const blogData = req.body
      console.log(blogData)
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          ...blogData,
        },
      }
      const result = await blogsCollection.updateOne(query, updateDoc, options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send("Hello from Farwah's Server....")
})

app.listen(port, () => console.log(`Server running on port ${port}`))
