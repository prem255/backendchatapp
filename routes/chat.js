const express = require('express')
const router = express.Router()
const {addNewContact,getContact,sendMessage,receiveMessage}=require('../controller/chatController')

router.post('/addNewContact', addNewContact)
router.get('/getContact', getContact)
router.post('/sendMessage', sendMessage)
router.post('/receiveMessage',receiveMessage)



module.exports = router