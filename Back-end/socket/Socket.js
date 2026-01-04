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
        socket.on("deleteMessageEveryone", async ({ messageId }) => {
            try {
                const message = await Message.findById(messageId)
                .populate("sender", "username email")
                .populate("chat");
            if(!message) return
            io.to(message.chat._id.toString()).emit(
                "messageDeleted",
                message
            );
        } catch (error) {
                console.log("socket delete error" , error)
            }
    })
    socket.on("disconnect" , ()=>{
        console.log("socket disconnected" , socket.id);
        
    })  
    })
}
module.exports = socketHandle