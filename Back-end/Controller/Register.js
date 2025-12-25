const User = require('../Model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// REGISTER
const registerUser = async (req , res) => {
    try{
        const {username , email , password} = req.body
        if(!username || !email || !password) return res.status(401).json({message : "All fields are required"})

        const oldName = await User.findOne({username})
        if(oldName) return res.status(401).json({message : "Name already taken"})
                
        const oldUser = await User.findOne({email})
        if(oldUser) return res.status(401).json({message : "Email already registered"})
        
        const hashedPassword = await bcrypt.hash(password , 10)
        const newUser = await User.create(
            {username , email , password : hashedPassword}
        )

        res.status(200).json({
            message : "User Registered Successfully" ,
            user : {
                id : newUser._id ,
                username : newUser.username ,
                email : newUser.email
            }
        })
    }
    catch (error){
        console.log(error);
        res.status(500).json({message : "Server error in registering"})
    }
}
// LOGIN
const loginUser = async (req , res) => {
    try{
        const{email , password} = req.body
        if(!email || !password) return res.status(401).json({message : "Email and Password are required"})

        const user = await User.findOne({email})
        if(!user) return res.status(401).json({message : "Invalid email"})

        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch) return res.status(401).json({message : " Invalid Password"})

        const token = jwt.sign(
            {id : user._id},
            process.env.SECRET_KEY,
        {expiresIn : '10d'}
        )

        res.status(200).json({
            message : "Login Successful",
            token ,
            user : {id : user._id , username : user.username , email : user.email}
        })
    }
    catch (error){
        console.log(error);
        res.status(500).json({message : "Server error in login"})
    }
}
// USER LIST
const getUsers = async(req , res) =>{
    try {
        const users = await User.find(
            {_id : {$ne : req.user.id}},
            "username email"
        )
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message : "fail fetching users" , error})
    }
}
module.exports = {registerUser , loginUser ,getUsers }