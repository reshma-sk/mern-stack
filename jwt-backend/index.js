const express = require('express')
const {connectMongoDb} = require('./connect')
const customerRouter = require('./routes/customer')
const cookieParser = require("cookie-parser");
const app = express()
const cors = require("cors")
const port = 5001;
app.use(cors({
    origin: "http://localhost:5173",  // Allow requests from your frontend domain
    credentials: true,                // Allow cookies and credentials
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())
app.use('/api/customers',customerRouter)
connectMongoDb("mongodb://127.0.0.1:27017/my-project")
.then(()=>{console.log('mongodb connected')})
.catch((err)=>console.log('mongo error',err))

app.listen(port,()=>console.log(`server runs at ${port}`))