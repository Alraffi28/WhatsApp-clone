const Message = require('../Model/Message');
const Chat = require('../Model/Chat')
// SENDING
const sendMessage = async(req , res) => {
    try{
        const {content , chatId} = req.body
        if(!content || !chatId) return res.status(401).json({message : "Content and chatID are required"})

        const newMessage = await Message.create({
            sender : req.user.id,
            content,
            chat : chatId
        })
        await Chat.findByIdAndUpdate(chatId , {latestMessage : newMessage._id})

        const populatedMessage = await Message.findById(newMessage._id)
        .populate("sender" , "username email")
        .populate("chat")
        res.status(200).json(populatedMessage)
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Error sending message"})
    }
}
// RECEIVING
const getMessage = async (req , res) => {
    try{
        const {chatId} = req.params
        const messages = await Message.find({chat : chatId})
        .populate("sender" , "username email")
        .populate("chat")
        .sort({createdAt : 1})
        res.status(200).json(messages)
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Error receiving message"})
    }
}
module.exports = {sendMessage , getMessage}