const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    // username and passord will be added by the passport plugin below
    // username: {
    //     type: String,
    //     required: true
    // },
    // password: {
    //     type: string,
    //     required: true
    // }
    email: {
        type: String,
        required: true,
        unique: true
        // validate: {
        //     regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        // }
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);