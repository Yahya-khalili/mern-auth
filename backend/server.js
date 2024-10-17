//const express = require("express")
import express from "express";
import { connectdb } from "./DB/connectDb.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";


dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log("server is running on server on port :",PORT)
});

app.get("/", (req , res ) => {
    connectdb();
    res.send("hello world 7");
})

app.use(express.json()); // allows us to parse incoming request  req.body 
 app.use(cookieParser());
app.use("/api/auth" , authRoutes)

