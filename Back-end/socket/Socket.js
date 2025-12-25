const Chat = require("../Model/Chat");
const Message = require("../Model/Message");

const socketHandle = (io) =>{
    io.on("connection" , (socket) =>{
        // join chat
        socket.on("joinChat" , (chatId)=>{
            socket.join(chatId)
            console.log(`Socket ${socket.id} joined in ${chatId}`);
        })
        // new msg
        socket.on("newMessage" , async(messageData)=>{
            try{
                const chatId = messageData.chat._id
                io.to(chatId).emit("messageReceived" , messageData)
            }catch(error){
                console.log("Socket error" , error);
            }
        })
        socket.on("disconnect" , ()=>{
            console.log("socket disconnect" , socket.id);
            
        })
        
    })
}
module.exports = socketHandle