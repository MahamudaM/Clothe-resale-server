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
const reportedItemsCollection = client.db("usedClotheStore").collection("reportedItems")
const advertisCollection = client.db("usedClotheStore").collection("advertised")
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

// get specific seller by email for seller verification
app.get('/seller/:email',async(req,res)=>{
    const email = req.params.email;
   const query={sellerEmail:email}
    const result = await clothesCollection.findOne(query);
    res.send(result)
})

// delete a specific seller
app.delete('/seller/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id:ObjectId(id)}
    const result = await allUserCollection.deleteOne(filter);
    res.send(result)
})

// get all buyer
app.get('/users',async(req,res)=>{
    const role = req.query.userRole;
     const query = {userRole: role}
     const users = await allUserCollection.find(query).toArray()
     res.send(users)
 })

// delete a specific seller
app.delete('/seller/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id:ObjectId(id)}
    const result = await allUserCollection.deleteOne(filter);
    res.send(result)
})

// delete specific buyer
app.delete('/users/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id:ObjectId(id)}
    const result = await allUserCollection.deleteOne(filter);
    res.send(result)
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
    
    res.send(result)
});

// get clothe by user email
app.get('/sellerclothe',async(req,res)=>{
    const email = req.query.email;
    const query = {sellerEmail:email}   
    const result= await clothesCollection.find(query).toArray();
    
    res.send(result)
});

app.delete('/sellerclothe/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id:ObjectId(id)}
    const result = await clothesCollection.deleteOne(filter);
    res.send(result)
})

/*=======================
all reportedItems api
========================
*/

// create reportedItems colletion
app.put('/clothe/reportedClothe/:id',async(req,res)=>{
    const id = req.params.id;
    console.log(id)
    const filter = {_id:ObjectId(id)}   
    const options = {upsert:true}
    const updatedDoc = {
        $set:{
            report :'true'
        }
    }
    const result= await clothesCollection.updateOne(filter,updatedDoc,options);
    res.send(result)
})


// get all reportedItems
app.get('/clothe/reported',async(req,res)=>{
    // const report = req.params.report;  
    // console.log(report) 
    const query = {report:"true"}
    console.log(query)
    // const reportedItems = await clothesCollection.find(query).toArray();
    // res.send(reportedItems)
    // res.send({reportProd:reportedItems?.report==='true'})
})
// delete reported itme
app.delete('/clothe/reportedClothe/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id:ObjectId(id)}
    const result = await clothesCollection.deleteOne(filter);
    res.send(result)
})
/*======================
all specific user route api
=============================*/
// check admin 
app.get('/alluser/admin/:email',async(req,res)=>{
    const email= req.params.email;
    const query = {email}
    const user = await allUserCollection.findOne(query)
    res.send({admin:user?.userRole==="admin"})
  })

// seller route api
app.get('/alluser/seller/:email',async(req,res)=>{
    const email= req.params.email;
    const query = {email}
    const user = await allUserCollection.findOne(query)
    res.send({seller:user?.userRole==="seller"})
  })

// buyer route api
app.get('/alluser/user/:email',async(req,res)=>{
    const email= req.params.email;
    const query = {email}
    const user = await allUserCollection.findOne(query)
    res.send({userCheck:user?.userRole==="user"})
  })


// create advertised product route
app.post('/advertised',async(req,res)=>{
    const product= req.body;   
    const result= await advertisCollection.insertOne(product);
    res.send(result)
})

app.get('/advertised',async(req,res)=>{
    const query = {}
    const result = await advertisCollection.find(query).toArray();
    res.send(result)
});

}
finally{

}
}
run().catch((error)=>{console.log(error)})

app.get('/',async(req,res)=>{
    res.send('second hand clothe store running')
})

app.listen(port,()=>console.log(`second hand clothe server run on ${port}`))

