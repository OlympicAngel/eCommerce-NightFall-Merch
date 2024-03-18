const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const otp = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    otp: {
        type: String,
        required: true,
        unique: true
    },

    userType: {
        type: String,
        default: "user",
        enum: ["user", "manager"],
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, //will be automatically deleted after 5 minutes of  creation time
    },
})

module.exports = mongoose.model('otp', otp)