const express = require('express')
const { checkFieldExists, createUser, updateUser, findDocumentById, findManyDocuments,findManyDocumentsusingQuerry} = require("../models/users");

const addNewContact = async (req, res) => {
    const { newContact } = req.body
    const { userId } = req.auth
    console.log(newContact, userId)
    try {
        // check the email in our users collection exists or not
        const newContactdetail = await checkFieldExists("User", "email", newContact)
        if (!newContactdetail) {
            return res.status(401).send({ message: "Contact is not on our app." })
        }

        // add newcontact to contact array of user
        const updatedUser = await updateUser("User", userId, { $addToSet: { contacts: newContact } }, { new: true });
        return res.send({ message: "contact add successfully", contacts: updatedUser.contacts })

    }
    catch (error) {
        return res.status(401).send({ messange: error.message })
    }
}

const getContact = async (req, res) => {
    const { userId } = req.auth
    try {
        const contacts = await findDocumentById("User", userId, "contacts")
        console.log(contacts)
        const userContactDetail = await findManyDocuments("User", "email", contacts.contacts, "name email profileImage")
        return res.send({ userContactDetail })
    }
    catch (error) {
        return res.status(401).send({ error: error.message })
    }
}

const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body
    const { userId, userEmail } = req.auth
    try {
        const data = {
            senderId: userEmail,
            receiverId,
            content
        }
        await createUser("Messages", data)
        res.send({ message: "your message send successfully" })
    }
    catch (error) {
        res.send({ message: error })
    }

}
const receiveMessage = async (req, res) => {
    const { receiverId } = req.body
    const { userId, userEmail } = req.auth
    try {
        const querry ={
            $or: [
              { senderId: userEmail, receiverId: receiverId },
              { senderId:receiverId, receiverId: userEmail}
            ]
          }
               
            const documents=await findManyDocumentsusingQuerry('Messages',querry)
           return  res.send({messages:documents})
        }
    
    catch (error) {
        res.send({ message: error })
    }
}
module.exports = { addNewContact, getContact, sendMessage,receiveMessage }
