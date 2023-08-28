const mongoose=require('mongoose')
var conn=require('../config/db')

// Define a user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  sessionToken: String,
    profileImage:{type:String,default:"https://material-ui.com/static/images/avatar/1.jpg"},
    contacts:{type:Array,default:['tk972021@gmail.com']},
     updated:{type:Date,default:Date.now}
});

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  created: { type: Date, default: Date.now }
})
const Messages=conn.model('Messages',messageSchema)
const User = conn.model('User', userSchema);


async function createUser(collectionName,data) {
  try {
    const collectionModel =mongoose.model(collectionName)
    const newUser = new collectionModel(data);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error('An error occurred while creating the user');
  }
}
async function findDocumentById(collectionName, documentId, fields ="") {
  const collectionModel = mongoose.model(collectionName);

  try {
    const document = await collectionModel.findById(documentId).select(fields);
    console.log(document)
    return document;
  } catch (error) {
    throw new Error(`An error occurred while finding the document: ${error.message}`);
  }
}

async function checkFieldExists(collectionName, fieldName, fieldValue,fields="") {
  const collectionModel = mongoose.model(collectionName);
  try {
    const document = await collectionModel.findOne({[fieldName]:fieldValue}).select(fields);
    console.log(document)
    return document;
  } catch (error) {
    throw new Error(`An error occurred while checking the field existence: ${error.message}`);
  }
}
async function findManyDocuments(collectionName, fieldName, fieldValues,fields="") {
  const collectionModel = mongoose.model(collectionName);
  try {
    const documents=await collectionModel.find({ [fieldName]: { $in:fieldValues  } }).select(fields)
    console.log(documents)
    return documents
  }
  catch (error) {
    return error
  }
}

async function findManyDocumentsusingQuerry(collectionName, querry) {
  const collectionModel = mongoose.model(collectionName);
  try {
    const documents=await collectionModel.find(querry)
    console.log(documents)
    return documents
  }
  catch (error) {
    return error
  }
}

function updateUser(collectionName, id, data, other = {}) {
  const collectionModel = mongoose.model(collectionName);
  try {
    const user = collectionModel.findByIdAndUpdate(id, data,other);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('An error occurred while updating the user');
  }
}
  



module.exports = {createUser,checkFieldExists,updateUser,findDocumentById,findManyDocuments,findManyDocumentsusingQuerry };