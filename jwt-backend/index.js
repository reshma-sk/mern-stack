/*const express = require('express')
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

app.listen(port,()=>console.log(`server runs at ${port}`))*/

const express = require('express');
const { connectMongoDb } = require('./connect');
const customerRouter = require('./routes/customer');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config(); // ✅ Must be called before accessing env vars

const app = express();
const port = 5001;

// ✅ Setup CORS
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
app.use(express.json());
app.use(cookieParser());
app.use('/api/customers', customerRouter);

// ✅ Start server only after MongoDB is connected
const startServer = async () => {
  try {
    await connectMongoDb(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected");

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Stop the process if DB connection fails
  }
};

startServer();

