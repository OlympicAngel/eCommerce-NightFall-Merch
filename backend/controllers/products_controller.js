const cloudinary = require('cloudinary').v2;
const fs = require("fs");
const ProductModel = require(`../models/Product`);
const CategoryModel = require(`../models/Category`);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = {
  //get all products
  getAll: async (req, res) => {
    try {
      const products = await ProductModel.find().populate({ path: "category" }).exec();

      return res.status(200).json({
        success: true,
        message: `רשימת מוצרים נשלפה בהצלחה`,
        products,
      });
    } catch (error) {
      return res.status(500).json({
        message: `לא היה ניתן לשלוף את המוצרים`,
        error: error.message,
      });
    }
  },

  //get single product
  getById: async (req, res) => {
    try {
      const product = await ProductModel.findById(req.params.id).populate({ path: "category" }).exec();

      return res.status(200).json({
        success: true,
        message: `מוצר נשלף בהצלחה`,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        message: `לא היה ניתן למצוא את המוצר`,
        error: error.message,
      });
    }
  },

  getRandom: async (req, res) => {
    try {
      let product = (await ProductModel.aggregate().sample(1)).pop()
      product = await ProductModel.populate(product, { path: "category" })

      return res.status(200).json({
        success: true,
        message: `רשימת מוצרים נשלפה בהצלחה`,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        message: `לא היה ניתן לשלוף את המוצרים`,
        error: error.message,
      });
    }
  },

  // /**returns related products by id */
  getRelatedByID: async (req, res) => {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product)
        return new Error("מוצר לחיפוש לא נמצא")

      // Extract individual words from the input product's title and description
      const titleWords = product.name.split(" ");
      const descriptionWords = product?.description?.trim()?.split(" ") || []; //description might be undefined

      const similarProducts = await ProductModel.aggregate([
        {
          $sample: { size: 50 } // Get 50 random documents from the collection
        },
        {
          $match: {
            _id: { $ne: product._id } // Exclude the input product itself
          }
        },
        {
          $project: {
            name: 1,
            price: 1,
            image: 1,
            description: 1,
            category: 1,
            similarityScore: {
              $add: [
                {// Increase score if category matches
                  $cond: [{
                    $eq: ['$category', product.category]
                  }, 0.5, 0]
                },
                {// compare title words array of each product and give relative score for each match 
                  $multiply: [{
                    $size: { $setIntersection: [titleWords, { $split: ['$name', " "] }] }
                  }, 2 / titleWords.length]
                },
                {// compare description words array of each product and give relative score for each match 
                  $multiply: [{
                    $size: { $setIntersection: [descriptionWords, { $split: ['$description', " "] }] }
                  }, descriptionWords.length > 0 ? (1 / descriptionWords.length) : 0]
                }
              ]
            }
          }
        },
        {
          $sort: { similarityScore: -1 } // Sort by similarity score in descending order
        },
        {
          $limit: 8 // Limit to 10 similar products
        }
      ]);

      const populatedProducts = await ProductModel.populate(similarProducts, { path: "category" })

      return res.status(200).json({
        success: true,
        message: `מוצרים נשלפו בהצלחה`,
        products: populatedProducts,
      });
    } catch (error) {
      return res.status(500).json({
        message: `לא היה ניתן למצוא מוצרים דומים`,
        error: error.message,
      });
    }
  },

  //get all product by category
  getByCategory: async (req, res) => {
    try {
      //find category
      const name = req.params.category
      if (!name)
        throw new Error("לא התקבלה קטגוריה")
      const products = await ProductModel.find({ category: name }).populate({ path: "category" }).exec();

      return res.status(200).json({
        success: true,
        message: `מוצרים לפי קטגוריה נשלפו`,
        products,
      });
    } catch (error) {
      return res.status(500).json({
        message: `לא היה ניתן מוצרים לפי קטגוריה זו`,
        error: error.message,
      });
    }
  },


  // manager functions
  managers: {
    addProduct: async (req, res) => {
      let cloudinary_asset_public_id;
      try {
        let image = req?.file?.path;

        // getting values from the body request
        const {
          name,
          description = "",
          price,
          category
        } = req.body;

        // creating ProductModel using the values from req.body
        const new_Product = ProductModel({
          name,
          description,
          price,
          image, //note: here image is without cloudinary - its just local path
          category,
        });


        //replace image with cloudinary storage
        if (req.file !== undefined) {
          const data = await cloudinary.uploader.upload(req.file.path); //upload to cloud
          cloudinary_asset_public_id = data.public_id; //set id to outer scope - in case of save error (delete purpose)
          fs.unlinkSync(req.file.path) //if no error - delete file origin
          new_Product.image = data.secure_url; //update db url
        }

        // actual saving
        await new_Product.save();

        // return success message
        return res.status(201).json({
          message: `נוסף מוצר חדש: '${name}'`,
          product: new_Product
        });
      } catch (error) {

        //if error delete asset from cloud
        if (cloudinary_asset_public_id) {
          cloudinary.uploader.destroy(cloudinary_asset_public_id).catch(() => { });
        }

        return res.status(400).json({
          message: `פעולת הוספת מוצר נכשלה`,
          error: error.message,
        });
      }
    },

    updateById: async (req, res) => {
      let cloudinary_asset_public_id;

      try {
        const id = req.params.id;
        //if file uploaded
        if (req.file !== undefined) {
          //upload file to cloudinary
          const data = await cloudinary.uploader.upload(req.file.path)
          cloudinary_asset_public_id = data.public_id; //set id to outer scope - in case of save error (delete purpose)
          fs.unlinkSync(req.file.path) //if no error - delete file origin
          req.body.image = data.secure_url;//replace image url
          //delete old image
          const product = await ProductModel.findById(id);
          if (product.image)
            cloudinary.uploader.destroy(product.getImgID()).catch(() => { });
        }

        //save
        await ProductModel.findByIdAndUpdate(id, req.body);

        return res.status(200).json({
          success: true,
          message: `מוצר עודכן בהצלחה`,
        });
      } catch (error) {

        //if error delete asset from cloud
        if (cloudinary_asset_public_id) {
          cloudinary.uploader.destroy(cloudinary_asset_public_id).catch(() => { });
        }

        return res.status(500).json({
          message: `לא היה ניתן לעדכן מוצר`,
          error: error.message,
        });
      }
    },

    deleteById: async (req, res) => {
      try {
        const id = req.params.id
        const product = await ProductModel.findByIdAndDelete(id);

        //if product has image - delete it from cloudinary
        if (product.image)
          cloudinary.uploader.destroy(product.getImgID()).catch(() => { });

        return res.status(200).json({
          message: `המוצר '${product.name}' נמחק!`,
        });
      } catch (error) {
        return res.status(400).json({
          message: `פעולת מחיקה נכשלה`,
          error: "לא היה ניתן למצוא מוצר עם המזהה הזה",
          error2: error.message,
        });
      }
    }
  }
};
