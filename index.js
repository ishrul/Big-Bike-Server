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
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");

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

    // get all users api
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // POST USER API
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // MAKE AN ADMIN
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log("put", user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // POST REVIEWS API
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);
      res.json(result);
    });

    // get all reviews api
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // DELETE ORDERS API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await OrdersCollection.deleteOne(query);
      res.json(result);
    });

    // get all bikes api
    app.get("/allBikes", async (req, res) => {
      const cursor = BikesColletion.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST BIKES API
    app.post("/allBikes", async (req, res) => {
      const bike = req.body;
      const result = await BikesColletion.insertOne(bike);
      console.log(result);
      res.json(result);
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
