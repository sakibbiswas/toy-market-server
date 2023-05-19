const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 4000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.db_users}:${process.env.db_pass}@cluster0.yk6uldw.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const database = client.db("ToyDB");
        const toyCollection = database.collection("Toys")

        const Database = client.db("ADDToyDB");
        const addtoyCollection = Database.collection("addToys")

        // creating index on the two fields
        const indexKEY = { Seller: 1, Name: 1 };
        const indexOptions = { Name: "SellerName" };
        const result = await toyCollection.createIndex(indexKEY, indexOptions)

        app.get('/searchByTitle/:text', async (req, res) => {
            const searchText = req.params.text;
            const result = await toyCollection.find({
                $or: [


                    { Seller: { $regex: searchText, $options: "i" } },
                    { Name: { $regex: searchText, $options: "i" } },

                ],


            }).toArray()
            res.send(result)
        })



        // Toy

        app.get('/toy', async (req, res) => {
            const cursor = addtoyCollection.find();
            const result = await cursor.toArray()
            res.send(result)

        })
        // update
        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addtoyCollection.findOne(query);
            res.send(result);
        })

        app.post('/toy', async (req, res) => {
            const NewToy = req.body;
            console.log(NewToy);
            const result = await addtoyCollection.insertOne(NewToy);
            res.send(result)
        })
        // update toy
        app.put('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const updatedToy = req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const Toy = {
                $set: {
                    name: updatedToy.name,
                    quantity: updatedToy.quantity,
                    Seller: updatedToy.Seller,
                    email: updatedToy.email,
                    price: updatedToy.price,
                    Details: updatedToy.Details,
                    photourl: updatedToy.photourl,

                },
            };
            const result = await addtoyCollection.updateOne(filter, Toy, options);
            res.send(result)

        })

        //Toys 
        app.get('/toys', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray()
            res.send(result)

        })



        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                projection: { Name: 1, img: 1, Rating: 1, price: 1, description: 1, Seller: 1 }
            }
            const result = await toyCollection.findOne(query, options);
            res.send(result);
        })

        // delete toy 
        app.delete('/toy/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) };
            const result = await addtoyCollection.deleteOne(query);
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








app.get('/', (req, res) => {
    res.send('toy is running')
})

app.listen(port, () => {
    console.log(` toy API is running  on port : ${port}`)
})