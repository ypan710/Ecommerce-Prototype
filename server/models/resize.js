const mongoose = require('mongoose');
const validator = require('validator');

const resizeSchema = new mongoose.Schema({
    original: {type: String, required: [true, 'Original image is required']},
    resized: {type: String, required: [true, 'Resized image is required']},
    dimension: {type: Number, required: [true, 'Dimension of image is required']}
});

const Resize = mongoose.model('resize', resizeSchema);

module.exports = Resize;