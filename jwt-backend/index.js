const express = require('express')
const {connectMongoDb} = require('./connect')
const customerRouter = require('./routes/customer')
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const mongoose = require('mongoose')

// Your MongoDB URI (you can store this in a `.env` file for security)
const mongoDbURL = process.env.MONGODB_URL; // or use the string directly
dotenv.config();
const app = express()
const cors = require("cors")
const port = 5001;
/* app.use(cors({
    //origin: process.env.FRONTEND_URL,  // Allow requests from your frontend domain
    origin:process.env.FRONTEND_URL,
    credentials: true,                // Allow cookies and credentials
})) */

const allowedOrigins = process.env.FRONTEND_URL.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
    
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())
app.use('/api/customers',customerRouter)
connectMongoDb(mongoDbURL)
.then(()=>{console.log('mongodb connected')})
.catch((err)=>console.log('mongo error',err))

app.listen(port,()=>console.log(`server runs at ${port}`))