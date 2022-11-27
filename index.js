const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { query } = require('express');
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
const clothesCollection = client.db("usedClotheStore").collection("clothes")
const bookingCollection = client.db("usedClotheStore").collection("bookings")
const allUserCollection = client.db("usedClotheStore").collection("allUsers")
app.get('/categore',async(req,res)=>{
    const query = {}
    const result = await categoreCollection.find(query).toArray();
    res.send(result)
});

// get specific categore data
app.get('/categore/:id',async(req,res)=>{
    const id = req.params.id;
    const query={catagoreID:id}        
    const categoreClothe = await clothesCollection.find(query).toArray();
    res.send(categoreClothe)
})


// get specific id clothe 
app.get('/clothe/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)}       
    const clothe = await clothesCollection.findOne(query);
    res.send(clothe)
    // console.log(selecterClothe)
})

/*=============
all Booking api
================
*/
// create booking colletion
app.post('/booking',async(req,res)=>{
    const booking = req.body;   
    const result= await bookingCollection.insertOne(booking);
    res.send(result)
})

// get specific bookin by email
app.get('/booking',async(req,res)=>{
    const bookemail= req.query.email;
    const query = {email:bookemail}
    const booking = await bookingCollection.find(query).toArray();
    res.send(booking)
})

/*=============
all user api
================
*/
// create user collection 
app.post('/allusers',async(req,res)=>{
    const user = req.body;    
    const result= await allUserCollection.insertOne(user);
    res.send(result)
})


//get all seller 
app.get('/seller',async(req,res)=>{
   const role = req.query.userRole;
    const query = {userRole: role}
    const seller = await allUserCollection.find(query).toArray()
    res.send(seller)
})

// get all buyer
app.get('/users',async(req,res)=>{
    const role = req.query.userRole;
     const query = {userRole: role}
     const users = await allUserCollection.find(query).toArray()
     res.send(users)
 })
/*=======================
all add newProduct api
========================
*/
// insert new product in clotheColletion
app.post('/clothe',async(req,res)=>{
    const product = req.body; 
    console.log(product)   
    const result= await clothesCollection.insertOne(product);
    console.log(result)
    res.send(result)
});

// get clothe by user email
app.get('/sellerclothe',async(req,res)=>{
    const email = req.query.email;
    const query = {sellerEmail:email}   
    const result= await clothesCollection.find(query).toArray();
    
    res.send(result)
});








}
finally{

}
}
run().catch(console.log)

app.get('/',async(req,res)=>{
    res.send('second hand clothe store running')
})

app.listen(port,()=>console.log(`second hand clothe server run on ${port}`))

