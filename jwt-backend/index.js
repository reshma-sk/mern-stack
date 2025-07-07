const express = require('express')
const {connectMongoDb} = require('./connect')
const customerRouter = require('./routes/customer')
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config();
const app = express()
const cors = require("cors")
const port = 5001;
app.use(cors({
    origin: process.env.FRONTEND_URL,  // Allow requests from your frontend domain
    credentials: true,                // Allow cookies and credentials
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())
app.use('/api/customers',customerRouter)
connectMongoDb("mongodb://127.0.0.1:27017/my-project")
.then(()=>{console.log('mongodb connected')})
.catch((err)=>console.log('mongo error',err))
app.get('/', (req, res) => {
    res.send('<h1>🚀 Backend is running on localhost:5001!</h1>');
});
app.listen(port,()=>console.log(`server runs at ${port}`))