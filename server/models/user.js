const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');


const userSchema = new mongoose.Schema({
  email: {type: String, required: [true, 'Email is required'], unique: [true, 'Email is taken'], validate: [validator.isEmail, 'Enter a valid email']},
  password: {type: String, required: [true, 'Password is required'], minLength: [4, 'Password must be at least 4 characters']},
  username: {type: String, required: [true, 'Username is required']},
  admin: {type: Boolean, required: [true, 'Account type is required']},
});

// middleware to hash password before saving
userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;