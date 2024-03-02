const Category = require("../models/Category");

module.exports = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.find().exec();

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
        const { name } = req.body;
        if (!name || name.length < 2)
          throw new Error("שם הקטגוריה קצר מידי")

        const category = new Category({ name });

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
        const { name } = req.body;
        if (!name || name.length < 2)
          throw new Error("שם הקטגוריה קצר מידי")

        await Category.findByIdAndUpdate(id, { name });

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
