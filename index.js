const express=require('express');
const app=express();
const cors=require('cors')
require('dotenv').config();
const {MongoClient,ServerApiVersion, ObjectId}=require('mongodb');
const port=process.env.PORT ||5000;
const mongoURI=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@shakir-cluster.ukodh.mongodb.net/?retryWrites=true&w=majority&appName=shakir-cluster`;

app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send(`job portal server is running`)
})
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
 const jobsCollection=await client.db("jobPortal").collection("jobs");
 console.log(jobsCollection)
    // jobs api
    app.get('/jobs',async(req,res)=>{
        try{
             const result=await jobsCollection.find().toArray()
            res.send((result))
        }
        catch(err){
           res.status(500).send({error:"Failed to Fetch"})
        }
    })
    app.get('/jobs/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result=await jobsCollection.findOne(query);
        res.send(result)
    })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})