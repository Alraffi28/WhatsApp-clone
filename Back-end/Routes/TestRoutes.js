const express = require('express');
const VerifyToken = require('../Middleware/UserMiddleware')

const router = express.Router()

router.get('/test' , VerifyToken , (req , res)=>{
    res.json({
        message : "Access granted",
        userId : req.user.id
    })
})

module.exports = router