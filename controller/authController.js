const express = require('express')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); // for sending emails
const jwt = require('jsonwebtoken');
const { generateRandomPassword, loginBodyValidater } = require('./helperAuth')
const { checkFieldExists, createUser, updateUser } = require("../models/users");


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g. 'Gmail', 'Yahoo', etc.
  auth: {
    user: 'munnabeta121@gmail.com',
    pass: 'ergescrusvamcrfj'
  }
});


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(await loginBodyValidater(email, password))) res.status(401).json({ error: 'Invalid credentials' });

    // Check if user with the provided email exists
    const user = await checkFieldExists("User", 'email', email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid User' });
    }
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // If credentials are valid, generate a session token
    const sessionToken = jwt.sign({ userId: user._id, email }, 'asdfghjklqwertyuiop');

    // Update the user's session token in the database
    await updateUser("User", user._id, { sessionToken });
    return res.json({ sessionToken, "message": "login successfully" });
  }
  catch (error) {
    res.status(401).send({ message: error?.message })
  }
}
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user with the same email already exists
    const existingUser = await checkFieldExists('User', "email", email)
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user instance
    const data = {
      name,
      email,
      password: hashedPassword
    };
    // Save the user to the database
    const savedUser = await createUser('User', data)
    // const savedUser = await newUser.save();

    // Send confirmation email
    const mailOptions = {
      from: 'munnabeta121@gmail.com',
      to: email,
      subject: 'Welcome to Our App',
      text: 'Thank you for signing up!'
    };
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Error sending email:', error);
    //   } else {
    //     console.log('Email sent:', info.response);
    //   }
    // });
    res.send({ message: "signup successfully" });

  }
  catch (error) {
    res.status(401).json({ error: error?.message });
  }
}
const forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user with the provided email exists
    const user = await checkFieldExists('User', 'email', email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("userfind here")
    // Generate a new password
    const newPassword = await generateRandomPassword();
    // Hash the new password
    console.log("new password generated", newPassword)

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("password hash generated")
    // Update the user's password in the database
    await updateUser('User', user._id, { password: hashedPassword });
    console.log("password change")
    // Send new password email
    const mailOptions = {
      from: 'munnabeta121@gmail.com',
      to: email,
      subject: 'New Password',
      text: `Your new password is: ${newPassword}`
    };
    console.log("mail options generated")
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'An error occurred while sending the email' });
      } else {
        console.log('Email sent:', info.response);
        return res.json({ message: 'New password sent to your email' });
      }
    });
  } catch (error) {
    res.status(401).json({ error: error?.message });
  }
}
module.exports = { login, signup, forgetpassword }