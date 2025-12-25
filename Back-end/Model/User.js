const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        minlength : [3 , " 3 or more than 3"],
        required : true ,
        unique : true
    },
    email : {
        type : String,
        minlength : [3 , "3 or more than 3"],
        required : true,
        unique : true,
        match : [/^\S+@\S+\.\S+$/ , "Please enter valid mail"]
    },
    password : {
        type : String,
        minlength : [8 , "8 or more than 8"],
        required : true
    }
},{timestamps: true})
module.exports = mongoose.model('User' , userSchema)