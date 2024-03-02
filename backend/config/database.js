const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.plugin(uniqueValidator, { message: 'השדה {PATH} הוא יחודי וכבר קיים במערכת' });
mongoose.plugin(schema => {
    schema.pre('findOneAndUpdate', setRunValidators);
    schema.pre('updateMany', setRunValidators);
    schema.pre('updateOne', setRunValidators);
    schema.pre('update', setRunValidators);
});

function setRunValidators() {
    this.setOptions({ runValidators: true });
}

const connection = async () => {
    let url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/master";
    try {
        await mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            /* useCreateIndex: true, */
            autoIndex: true,
        });
        console.log("mongoose connected to DB");
    } catch (error) {
        console.log(error);
    }
};

module.exports = connection;