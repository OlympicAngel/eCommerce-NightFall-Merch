const Category = require("../models/Category");
const Product = require("../models/Product");

module.exports = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.find().lean().exec();

      await Promise.all(categories.map(async (c, i) => {
        try {
          // Find a product with the same category
          const p = await Product.findOne({ category: c._id, image: { $exists: true } });
          c.image = p.image;
        } catch (e) { }
      }));

      return res.status(200).json({
        success: true,
        message: `כל הקטגוריות נשלפו בהמלחה`,
        categories,
      });
    } catch (error) {
      return res.status(500).json({
        message: `שגיאה בשליפת כל הקטגוריות`,
        error: error.message,
      });
    }
  },

  // managers functions
  managers: {
    add: async (req, res) => {
      try {
        const { name, color } = req.body;
        if (!name || name.length < 2)
          throw new Error("שם הקטגוריה קצר מידי")

        const category = new Category({ name, color });

        await category.save();

        return res.status(201).json({
          success: true,
          message: `קטגוריה נוספה`,
        });
      } catch (error) {
        return res.status(500).json({
          message: `שגיאה בהוספת קטגוריה`,
          error: error.message,
        });
      }
    },
    updateById: async (req, res) => {
      try {
        const id = req.params.id;
        const { name, color } = req.body;
        if (!name || name.length < 2)
          throw new Error("שם הקטגוריה קצר מידי")

        await Category.findByIdAndUpdate(id, { name, color });

        return res.status(200).json({
          success: true,
          message: `קטגוריה עודכנה בהצלחה`,
        });
      } catch (error) {
        return res.status(500).json({
          message: `שגיאה בעדכון קטגוריה`,
          error: error.message,
        });
      }
    },
    deleteById: async (req, res) => {
      try {
        const id = req.params.id;

        await Category.findByIdAndDelete(id);

        return res.status(200).json({
          success: true,
          message: `קטגוריה נמחקה בהצלחה`,
        });
      } catch (error) {
        return res.status(500).json({
          message: `שגיאה בעדכון קטגוריה`,
          error: error.message,
        });
      }
    }
  }
};
