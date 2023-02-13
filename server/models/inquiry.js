const mongoose = require('mongoose');
const validator = require('validator');

// userID is who is sending the inquiry

const inquirySchema = new mongoose.Schema({
  listingID: {type: String, required: true},
  userID: {type: String, required: [true, 'User ID is required']},
  username: {type: String, required: [true, 'Username is required']},
  message: {type: String, required: [true, 'Message is required']},
});

const Inquiry = mongoose.model('inquiries', inquirySchema);

module.exports = Inquiry;