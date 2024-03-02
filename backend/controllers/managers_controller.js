let MangerModel = require(`../models/Manager`);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const managerTokenDuration = 1000 * 60 * 60 * 2; //2H


module.exports = {

  // functions for admins
  addManagerForAdmins: async (req, res) => {
    try {
      // gettind values from the body request
      const { name, email, password, phone, address } =
        req.body;

      // creating MangerModel using the values from req.body
      const new_manager = MangerModel({
        name,
        email,
        password,
        phone: phone || "",
        address: address || "",
      });

      // actual saving
      await new_manager.save();

      // return success message
      return res.status(200).json({
        success: true,
        message: `success to add new manager`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in add manager`,
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const models = await MangerModel.find().populate([
        "cart",
        "orders.order",
      ]).exec();

      return res.status(200).json({
        success: true,
        message: `success to find all managers`,
        managers: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in get all managers`,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const models = await MangerModel.findById(req.params.id).populate([
        "cart",
        "orders.order",
      ]).exec();

      return res.status(200).json({
        success: true,
        message: `success to find manager by id`,
        managers: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in find manager by id}`,
        error: error.message,
      });
    }
  },

  updateById: async (req, res) => {
    try {
      const id = req.params.id;

      await MangerModel.findByIdAndUpdate(id, req.body).exec();

      return res.status(200).json({
        success: true,
        message: `success to update manager by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in update manager by id`,
        error: error.message,
      });
    }
  },

  deleteById: async (req, res) => {
    try {
      const id = req.params.id;

      await MangerModel.findByIdAndDelete(id).exec();

      return res.status(200).json({
        success: true,
        message: `success to delete manager by id`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `error in delete manager by id`,
        error: error.message,
      });
    }
  },
  /**
   * 
   * @param {*} req 
   * @param {import("express").Response} res 
   * @returns 
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const manager = await MangerModel.findOne({ email });
      if (!manager)
        throw new Error("אמייל או סיסמה שגויים");

      const equal = await bcrypt.compare(password, manager.password);
      if (!equal)
        throw new Error("אמייל או סיסמה שגויים.");

      // manager login success
      let payload = { manager: manager._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: managerTokenDuration });

      //remove expired tokens
      let oldTokens = manager.tokens || [];
      if (oldTokens.length) {
        oldTokens = oldTokens.filter(t => {
          const timeDiff = (Date.now() - ~~t.signedAt) / 1000;
          if (timeDiff < managerTokenDuration) {
            return t;
          }
        });
      }
      manager.tokens = [...oldTokens, { token, signedAt: Date.now().toString() }];
      await manager.save(); //save token update

      res.cookie("token", token, { "maxAge": managerTokenDuration, httpOnly: true })

      return res.status(201).json({
        message: "התחברת בהצלחה!",
        token,
        manager: {
          _id: manager._id,
          name: manager.name,
          email: manager.email,
        },
      });
    } catch (error) {
      return res.status(401).json({
        message: "שגיאה בהתחברות",
        error: error.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const tokens = req.manager.tokens;
      const newTokens = tokens.filter(t => t.token !== req.token);
      await MangerModel.findByIdAndUpdate(req.manager._id, { tokens: newTokens }).exec();
      res.clearCookie("token");

      return res.status(200).json({
        success: true,
        message: "התנתקת בהצלחה.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "שגיאה בהתנתקות..",
        error: error.message,
      });
    }
  },

  /**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
  authManagerToken: async (req, res) => {
    try {
      //get token
      const { token } = req.cookies;
      if (!token)
        throw new Error("חסר טוקן משתמש בבקשה לשרת");

      //get data stored within token
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      //check that that user has permission
      const manager = await MangerModel.findById(decode.manager).exec();
      if (!manager || manager.permission <= 1)
        throw new Error("אין לך מספיק גישה בשביל לגשת לפה");

      //check that current token is in the allowed tokens of that user (if not that token got logged out)
      const status = manager.tokens.some((t) => t.token == token)
      if (!status)
        throw new Error("משתמש זה נותק - יש להתחבר מחדש")


      //manager login refresh
      let payload = { manager: manager._id };
      const new_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: managerTokenDuration });
      //filter out older (current)token
      const updatedTokens = manager.tokens.filter((t) => t.token !== token);
      await MangerModel.findByIdAndUpdate(manager._id, {
        tokens: [...updatedTokens, { token: new_token, signedAt: Date.now().toString() }],
      }).exec();

      //send new token to client
      res.cookie("token", new_token, { "maxAge": managerTokenDuration, httpOnly: true })

      return res.status(201).json({
        success: true,
        message: "משתמש אומת",
        token: new_token,
        manager: {
          _id: manager._id,
          name: manager.name,
          email: manager.email,
        },
      });
    } catch (error) {
      //force delete token to prevent all steps above next time
      res.clearCookie("token");

      return res.status(401).json({
        message: "unauthorized",
        error: error.message,
      });
    }
  },
};
