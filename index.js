const express = require('express')
const app = express()
const cors = require('cors')


const port = process.env.PORT || 4000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('toy is running')
})

app.listen(port, () => {
    console.log(` toy API is running  on port : ${port}`)
})