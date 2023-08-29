const mongoose = require('mongoose');
const uri = "mongodb+srv://prem1232:prem1232@cluster0.spi5j.mongodb.net/chat?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = mongoose
