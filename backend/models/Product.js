const { Schema, model, default: mongoose } = require("mongoose");

const product = new Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "שם המוצר כבר קיים במערכת"],
    minlength: [2, "שם המוצר חייב להיות לפחות 2 תווים"]
  },

  description: {
    type: String,
    maxlength: [300, "תיאור מוצר לא יכול להיות יותר מ 300 תווים"]
  },

  price: {
    type: Number,
    required: true,
    min: [0, "המחיר לא יכול להיות שלילי"]
  },

  image: {
    type: String,
    match: [/\.(jpg|jpeg|png)$/i, "פורמט התמונה לא נתמך"],
  },

  category: {
    type: mongoose.Types.ObjectId,
    ref: "categories",
    required: true,
  }
});

product.methods.getImgID = function () {
  return this.image.split("/").pop().split(".")[0]
}


module.exports = model("products", product);