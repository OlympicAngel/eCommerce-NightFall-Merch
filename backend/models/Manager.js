const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;
const schema = new Schema({
    name: {
        type: String,
        required: [true, "חובה לציין שם"],
        unique: true,
        minlength: [2, "שם חייב להיות לפחות 2 תווים"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "חובה לציין אימייל"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'אימייל לא תקין'],
    },
    password: {
        type: String,
        required: true,
        minlength: [4, "סיסמה חייבת להיות לפחות 4 תווים"],
    },
    tokens: [{ type: Object }],
    permission: {
        type: Number,
        default: 1
    }
})

schema.pre('save', async function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 15);
    this.password = hash;
    next();
})

module.exports = mongoose.model('managers', schema)