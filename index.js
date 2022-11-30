const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { query } = require('express');
const port =process.env.PORT || 5000;
const app= express()
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.4jfewjr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
try{
const categoreCollection = client.db("usedClotheStore").collection("categores")
const clothesCollection = client.db("usedClotheStore").collection("clothes")
const bookingCollection = client.db("usedClotheStore").collection("bookings")
const allUserCollection = client.db("usedClotheStore").collection("allUsers")
const paidProductCollection = client.db("usedClotheStore").collection("paidProduct")

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
// get booking by id
app.get('/booking/:id',async(req,res)=>{
    const id= req.params.id;
    const query = {_id:ObjectId(id)}
    const book = await bookingCollection.findOne(query);
    res.send(book)
})
// stripe payment api
app.post("/create-payment-intent", async (req, res) => {
    const bookInfo = req.body;
  const price = bookInfo.price;
  const amount = price*100
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      "payment_method_types": [
        "card"
      ]
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

  app.post('/paidProduct',async(req,res)=>{
    const paidProd = req.body;   
    const result= await paidProductCollection.insertOne(paidProd);
    const id = paidProd.bookingId;
    const filter = {_id:ObjectId(id)}
    const updatedDoc = {
        $set:{
            paid:true,
            transId:paidProd.transId
        }
    }
    const udateBookColle = await bookingCollection.updateOne(filter,updatedDoc)
   
    res.send(result)
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


 /*==========================
   seller verification
 ==============================*/
app.put('/seller/:email',async(req,res)=>{
    const email = req.params.email;
    console.log(email)
    const filter = {email:email}   
    const options = {upsert:true}
    const updatedDoc = {
        $set:{
            ver :'true'
        }
    }
    const result= await allUserCollection.updateOne(filter,updatedDoc,options);
    res.send(result)
})

   
// get verify seller
app.get('/seller/:email',async(req,res)=>{
    const email = req.params.email; 
    const query = {sellerEmail:email}
      
    const verifySeller = await clothesCollection.findOne(query);
    res.send(verifySeller)
    // res.send({verify:verifySeller?.ver==='true'})
    
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
app.get('/reported',async(req,res)=>{
    // const repot = req.query.report;  
    // console.log(report) 
    // const query = {report:repot}
    // const query = {report:"true"}
    const query ={"report":"true"}
    console.log(query)
    const reportedItems = await clothesCollection.find(query).toArray();
    res.send(reportedItems)
    // res.send({reportProd:reportedItems?.report==='true'})
})
// http://localhost:5000/reported
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

// check seller route api
app.get('/alluser/seller/:email',async(req,res)=>{
    const email= req.params.email;
    const query = {email}
    const user = await allUserCollection.findOne(query)
    res.send({seller:user?.userRole==="seller"})
  })

//check  buyer route api
app.get('/alluser/user/:email',async(req,res)=>{
    const email= req.params.email;
    const query = {email}
    const user = await allUserCollection.findOne(query)
    res.send({userCheck:user?.userRole==="user"})
  })



/*==========================
all advertised api
============================ */

// create advertised product route
app.put('/advertised/:id',async(req,res)=>{
    const id = req.params.id;
    console.log(id)
    const filter = {_id:ObjectId(id)}   
    const options = {upsert:true}
    const updatedDoc = {
        $set:{
            adProd :'adv'
        }
    }
    const result= await clothesCollection.updateOne(filter,updatedDoc,options);
    res.send(result)
})

    /*==============
    get advProd
    ================*/

app.get('/advertised',async(req,res)=>{
    const prod = req.query.adv; 
    const query = {adProd:prod}
      
    const adProds = await clothesCollection.find(query).toArray();
    res.send(adProds)
    // res.send({advProd:adProds?.adProd==='adv'})
    
})

}
finally{

}
}
run().catch((error)=>{console.log(error)})

app.get('/',async(req,res)=>{
    res.send('second hand clothe store running')
})

app.listen(port,()=>console.log(`second hand clothe server run on ${port}`))

