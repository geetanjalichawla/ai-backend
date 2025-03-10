require('dotenv/config');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const questionRoutes = require('./routes/question');
const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit the process if connection fails
  }
};

// Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api' , questionRoutes); 
app.get("/", (req, res) => {
  res.send("Hello World! My name is " + process.env.PORT);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
