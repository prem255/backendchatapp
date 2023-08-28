const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); // for sending emails
const jwt = require('jsonwebtoken');
const { generateRandomPassword, loginBodyValidater } = require('../controller/helperAuth')

const { login, signup, forgetpassword } = require('../controller/authController');



router.post('/login',login ) 
router.post('/signup', signup)

router.post('/forgetpassword',forgetpassword)

module.exports = router