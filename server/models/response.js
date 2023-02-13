const mongoose = require('mongoose');
const validator = require('validator');

// userID is who is sending the response
// recipient

const responseSchema = new mongoose.Schema({
  listingID: {type: String, required: true},
  inquiryID: {type: String, required: true},
  recipientID: {type: String, required: [true, 'Recipient ID is required']},
  userID: {type: String, required: [true, 'User ID is required']},
  username: {type: String, required: [true, 'Username is required']},
  message: {type: String, required: [true, 'Message is required']},
});

const Response = mongoose.model('responses', responseSchema);

module.exports = Response;