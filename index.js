const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 4000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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

            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }


            const cursor = toyCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)

        })
        // update

        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        app.post('/toy', async (req, res) => {
            const NewToy = req.body;

            const result = await toyCollection.insertOne(NewToy);
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
                    Name: updatedToy.Name,
                    Available_Quantity: updatedToy.Available_Quantity,
                    Seller: updatedToy.Seller,
                    email: updatedToy.email,
                    price: updatedToy.price,
                    description: updatedToy.description,
                    img: updatedToy.img,

                },
            };
            const result = await toyCollection.updateOne(filter, Toy, options);
            res.send(result)

        })

        //Toys 
        app.get('/toys', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray()
            res.send(result)

        })


        // toys
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { Name: 1, img: 1, Rating: 1, price: 1, description: 1, Seller: 1, photo: 1, name: 1, Details: 1, Available_Quantity: 1, email: 1, }
            }
            const result = await toyCollection.findOne(query, options);
            res.send(result);
        })

        // delete toy 
        //add
        app.delete('/toy/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
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
    res.send('toy is running');
})

app.listen(port, () => {
    console.log(` toy API is running  on port : ${port}`);
})