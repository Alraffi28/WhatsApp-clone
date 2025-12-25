const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB Atlas Connected");
    }
    catch(err){
        console.log(err)
    }
}
module.exports = connectDB