"use strict"

const jwt = require('jsonwebtoken');
const { checkFieldExists, findDocumentById } = require('../models/users');

module.exports = async (req, res, next) => {
    // taking session Token
    console.log(req.headers)
    const sessionToken = req.headers["authorization"]
    console.log("session token receive from path",req.path,"and session token is ",sessionToken)
    const nonSecurePaths = [
        "/api/auth/login",
        "/api/auth/signup",
        "/api/auth/forgetpassword"
    ]
    const securePaths = [
        "/",
        "/api/chat/addNewContact",
        "/api/chat/getContact",
        "/api/chat/sendMessage",
        "/api/chat/receiveMessage"
    ]
    if (!nonSecurePaths.includes(req.path)) {
        if (!securePaths.includes(req.path)) {
            return res.status(404).json({ error: 'Path not found' });
        }
        if (!sessionToken) {
            return res.status(401).json({ error: 'Session token missing' });
        }

        try {
            var decoded = jwt.verify(sessionToken, 'asdfghjklqwertyuiop');
            console.log(decoded)
            const user = await findDocumentById("User", decoded.userId)
            if(!user) res.status(401).send({message:"invalid session token"})
            const dbSessionToken = user?.sessionToken
            console.log(dbSessionToken)
            console.log(sessionToken)
            if (dbSessionToken !== sessionToken) {
                return res.status(401).send({ message: "you are using old session token" })
            }
            else {
                req.auth={userId:decoded.userId,userEmail:user.email} 
            }
          
          } catch(err) {
            return res.status(404).send({message:err.message})
          }
        
    }
    next()
    
}