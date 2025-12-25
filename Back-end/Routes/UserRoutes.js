const express = require('express');
const {registerUser,loginUser, getUsers} = require('../Controller/Register');
const VerifyToken = require('../Middleware/UserMiddleware');
const router = express.Router();

router.post('/register' , registerUser)
router.post('/login' , loginUser)
router.get('/users' , VerifyToken , getUsers)

module.exports = router