const express = require('express');
const VerifyToken = require('../Middleware/UserMiddleware');
const { sendMessage, getMessage, deleteMessage, deleteForAll } = require('../Controller/MsgController');
const router = express.Router()

router.post('/' , VerifyToken , sendMessage)
router.get('/:chatId' , VerifyToken , getMessage)
router.delete('/delete/:messageId' , VerifyToken , deleteMessage)
router.put('/delete-everyone/:messageId' , VerifyToken , deleteForAll)

module.exports = router
