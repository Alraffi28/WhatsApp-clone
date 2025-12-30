const express = require('express');
const VerifyToken = require('../Middleware/UserMiddleware');
const { accessChat, fetchChat, createGroupChat } = require('../Controller/ChatController');
const router = express.Router()

router.post('/' , VerifyToken , accessChat)
router.get('/' , VerifyToken , fetchChat) //gets all chats of a user
router.post('/group' , VerifyToken , createGroupChat)

module.exports = router