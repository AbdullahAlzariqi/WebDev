const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    username: String,
    body: String,
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    description: String,
    location: String
});

module.exports = mongoose.model('Review', reviewSchema);