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
        let chats = await Chat.find({
            users : {$in : [req.user.id]} //to find all chats where I exist
        })
        .populate("users" , "-password")
        .populate("groupAdmin" , "-password")
        .populate("latestMessage")
        .sort({updatedAt : -1})
        chats = chats.map((chat)=>{
          if(
            chat.latestMessage &&
            chat.latestMessage.deletedFor?.includes(req.user.id)
          ){
            chat.latestMessage = null
          }
          return chat
        })
        res.status(200).json(chats)
    } catch (err) {
        console.log(err);
        res.status(500).json({message : "Error fetching chat"})
    }
}
// GROUP
const createGroupChat = async (req, res) => {
  const { users, chatName } = req.body;

  if (!users || users.length < 2) {
    return res.status(400).json({
      message: "Group must have at least 3 users",
    });
  }

  users.push(req.user.id); // add creator

  try {
    const groupChat = await Chat.create({
      chatName,
      users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "username email")
      .populate("groupAdmin", "username email");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: "Failed to create group" });
  }
}
module.exports = {accessChat , fetchChat , createGroupChat}