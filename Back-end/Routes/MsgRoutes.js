const express = require('express');
const VerifyToken = require('../Middleware/UserMiddleware');
const { sendMessage, getMessage } = require('../Controller/MsgController');
const router = express.Router()

router.post('/' , VerifyToken , sendMessage)
router.get('/:chatId' , VerifyToken , getMessage)

module.exports = router
