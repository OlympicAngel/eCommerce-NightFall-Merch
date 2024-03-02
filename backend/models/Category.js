const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const category = new Schema({

    name: {
        type: String,
        required: [true, "חובה לציין שם"],
        minlength: [2, "השם חייב להיות לפחות 2 תווים"]
    }
})



module.exports = mongoose.model('categories', category)