const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =process.env.PORT || 5000;
const app= express()
require('dotenv').config()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.mongoUser}:${process.env.mongoPassword}@cluster0.4jfewjr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
try{
const categoreCollection = client.db("usedClotheStore").collection("categores")
app.get('/categore',async(req,res)=>{
    const query = {}
    const result = await categoreCollection.find(query).toArray();
    res.send(result)
})
}
finally{

}
}
run().catch(console.log)

app.get('/',async(req,res)=>{
    res.send('second hand clothe store running')
})

app.listen(port,()=>console.log(`second hand clothe server run on ${port}`))

