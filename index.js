const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsezq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("Big-Bikes");
    const BikesColletion = database.collection("Bikes");
    const OrdersCollection = database.collection("Orders");

    // get all ORDERS api
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      console.log(query);
      const cursor = OrdersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST Orders API
    app.post("/myOrder", async (req, res) => {
      const order = req.body;
      const result = await OrdersCollection.insertOne(order);

      res.json(result);
    });

    // DELETE ORDERS API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await OrdersCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    // get all bikes api
    app.get("/allBikes", async (req, res) => {
      const cursor = BikesColletion.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Big Bike!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
