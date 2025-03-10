import "dotenv/config";
const express = require('"express"')
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World! My name is " + process.env.PORT);
});

app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
