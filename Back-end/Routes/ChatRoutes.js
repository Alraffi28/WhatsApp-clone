const express = require('express');
const VerifyToken = require('../Middleware/UserMiddleware');
const { accessChat, fetchChat } = require('../Controller/ChatController');
const router = express.Router()

router.post('/' , VerifyToken , accessChat)
router.get('/' , VerifyToken , fetchChat) //gets all chats of a user

module.exports = router