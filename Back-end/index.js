const connectDB = require('./Config/db');
const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');

const UserRoutes = require('./Routes/UserRoutes')
const TestRoutes = require('./Routes/TestRoutes')
const MsgRoutes = require('./Routes/MsgRoutes')
const ChatRoutes = require('./Routes/ChatRoutes');

const socketHandle = require('./socket/Socket')
require('dotenv').config()

const app = express();

app.use(cors())
app.use(express.json())
connectDB()

app.use('/wp',UserRoutes , TestRoutes)
app.use('/wp/message' , MsgRoutes)
app.use('/wp/chat' , ChatRoutes)

const server = http.createServer(app)
const io = new Server(server , {
    cors : {
        origin : "*",
        methods : ["GET" , "POST"]
    }
})
socketHandle(io)
const PORT = 5000
server.listen(PORT , ()=>{
    console.log(`server running on ${PORT}`);
    
})