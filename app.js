const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const router=require('router')
var app = express();
const cors=require('cors')
const checkAuth=require('./middleware/auth')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({ origin: '*' }));

// auth middleware
  // app.use(checkValidator);
  app.use(checkAuth);

  // Parse incoming JSON data
app.use(bodyParser.json());

// all routes here
const routes=require('./routes')
// app.set('trust proxy',true)
app.use('/api', routes)


app.get('/', (req, res) => {
  res.send({id:req.userId,message:"api is working fine"})
})

app.listen(3001, () => {
  console.log("app is running on port 3001")
})




module.exports = app;
