const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// Connect DB
const uri = process.env.MONGO_URI;
mongoose.connect(uri, () => console.log("mongoDB connected"));

// Middleware
app.use(express.json()); // This is the body parser.
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Route Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
