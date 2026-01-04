const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema(
    {
        sender : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User",
            required : true
        },
        content : {
            type : String,
            trim : true,
            required : true
        },
        chat : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Chat",
            required : true
        },
        deletedFor : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }],
        isDeleted : {
            type : Boolean,
            default : false
        }
    },
    {timestamps : true}
)
module.exports = mongoose.model("Message" , msgSchema)