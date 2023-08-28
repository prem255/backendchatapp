const express = require('express');
const router = express.Router();

// requiring all routes
const auth = require("./auth") 
const chat=require("./chat")
    
// using all router  
router.use('/auth', auth)
router.use('/chat',chat)


module.exports = router;

