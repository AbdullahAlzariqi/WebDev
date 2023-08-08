const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectID,
        ref: 'User'
    },
    body: String,
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
});

module.exports = mongoose.model('Review', reviewSchema);