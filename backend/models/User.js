const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const User = new Schema({
    name: {
        type: String,
        required: [true, "חובה לציין שם"],
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
    phone: {
        type: String,
        match: /^([0]\d{1,3}[-])?\d{7,10}$/
    },
    address: {
        city: {
            type: String,
            trim: true,
            required: true
        },
        street: {
            type: String,
            trim: true,
            required: true
        },
        building: {
            type: String,
            trim: true
        },
    },
    orders: {
        type: Number,
        default: 0
    },
    tokens: [{ type: Object }]
})

User.pre('save', async function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password)
    next();
})
User.pre('findOneAndUpdate', async function (next) {
    if (!this._update.password) return next();
    this._update.password = await hash(this._update.password)
    next();
});

async function hash(pass) {
    return await bcrypt.hash(pass, 10);
}

module.exports = mongoose.model('users', User)