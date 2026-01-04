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
        const messages = await Message.find({chat : chatId , deletedFor:{$ne : req.user.id}})
        .populate("sender" , "username email")
        .populate("chat")
        .sort({createdAt : 1})
        res.status(200).json(messages)
    }catch(error){
        console.log(error);
        res.status(500).json({message : "Error receiving message"})
    }
}
// DELETE
const deleteMessage = async (req , res) => {
    const {messageId} = req.params;
    const userId = req.user.id
    try {
        await Message.findByIdAndUpdate(messageId , {
            $addToSet : {deletedFor : userId}
        })
        res.json({message : "Deleted for you"})
    } catch (error) {
        res.status(500).json({message : "Failed to delete" , error})
    }
}
// DELETE FOR ALL
const deleteForAll = async (req , res) =>{
    const {messageId} = req.params
    try {
        const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this message" });
    }

    message.isDeleted = true;
    message.content = "This message was deleted";
    message.deletedFor = []; // visible to all

    await message.save();

    const populatedMessage = await Message.findById(messageId)
      .populate("sender", "username email")
      .populate("chat");

    res.json(populatedMessage)
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
}
module.exports = {sendMessage , getMessage ,deleteMessage , deleteForAll}