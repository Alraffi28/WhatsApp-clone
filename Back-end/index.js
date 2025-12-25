const connectDB = require('./Config/db');
const express = require('express');
const cors = require('cors');

const UserRoutes = require('./Routes/UserRoutes')
const TestRoutes = require('./Routes/TestRoutes')
const MsgRoutes = require('./Routes/MsgRoutes')
const ChatRoutes = require('./Routes/ChatRoutes');


require('dotenv').config()

const app = express();

app.use(cors())
app.use(express.json())
connectDB()

app.use('/wp',UserRoutes , TestRoutes)
app.use('/wp/message' , MsgRoutes)
app.use('/wp/chat' , ChatRoutes)

app.get("/api-test" , (req , res) => {
    res.json({message : "API working"})
})

module.exports = app