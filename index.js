const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

//----------middleware----------
app.use(cors());
app.use(express.json());

//----------mongo db----------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1yvkcvu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //----------db & collection----------
        const productCollection = client
            .db("productsDb")
            .collection("products");
        const blogCollection = client.db("blogsDb").collection("blogs");

        //----------http methods----------
        app.get("/", (req, res) => {
            res.send(" This is AnC Global Ltd server side");
        });
        //----- product post, get, delete
        app.get("/products", async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        });

        app.post("/addproduct", async (req, res) => {
            const newProduct = req.body;
            console.log("product added:", newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });
        //----- blog post, get, delete
        app.get("/blogs", async (req, res) => {
            const result = await blogCollection.find().toArray();
            res.send(result);
        });
        app.get("/blogs/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });
        app.delete("/blogs/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.deleteOne(query);
            res.send(result);
        });

        app.post("/addblog", async (req, res) => {
            const newBlog = req.body;
            console.log("product added:", newBlog);
            const result = await blogCollection.insertOne(newBlog);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

//----------server listener----------
app.listen(port, () => {
    console.log(`AnC server running on port :${port}`);
});
