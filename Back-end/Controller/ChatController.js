const Chat = require('../Model/Chat');

// ACCESS
const accessChat = async (req , res) =>{
    try{
        const {userId} = req.body
        if(!userId) return res.status(401).json({message : "UserID is required"})

        let chat = await Chat.findOne({
            isGroupChat : false ,
            users : {$all : [req.user.id , userId]} //for finding a chat where both users exist together
        })
        .populate("users" , "-password")
        .populate("latestMessage")

        if(chat) return res.status(200).json(chat)
        
        const newChat = await Chat.create({
            chatName : "sender",
            isGroupChat : false ,
            users : [req.user.id , userId]
        })

        const fullChat = await Chat.findById(newChat._id)
        .populate("users" , "-password")
        res.status(200).json(fullChat)
    }catch(err){
        console.log(err);
        res.status(500).json({message : "Error accessing chat"})
    }
}
// FETCH
const fetchChat = async (req , res) =>{
    try {
        const chats = await Chat.find({
            users : {$in : [req.user.id]} //to find all chats where I exist
        })
        .populate("users" , "-password")
        .populate("groupAdmin" , "-password")
        .populate("latestMessage")
        .sort({updatedAt : -1})
        res.status(200).json(chats)
    } catch (err) {
        console.log(err);
        res.status(500).json({message : "Error fetching chat"})
    }
}
module.exports = {accessChat , fetchChat}