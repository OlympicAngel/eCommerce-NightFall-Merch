let MangerModel = require(`../models/Manager`);
let OtpModel = require(`../models/Otp`);

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');
const { userResetPassword } = require("../utils/email");

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
        message: `מנהל נוסף בהצלחה`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `שגיאה בהוספת מנהל חדש`,
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const managers = await MangerModel.find().exec();

      managers.forEach(m => {
        m.password = undefined;
        m.tokens = undefined;
      })

      return res.status(200).json({
        success: true,
        message: `כל המנהלים נשלפו בהצלחה`,
        managers
      });
    } catch (error) {
      return res.status(500).json({
        message: `שגיאה בזמן שליפת מנהלים`,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const models = await MangerModel.findById(req.params.id).exec();

      return res.status(200).json({
        success: true,
        message: `מנהל נשלף בהצלחה`,
        managers: models,
      });
    } catch (error) {
      return res.status(500).json({
        message: `שגיאה בשליפת מנהל`,
        error: error.message,
      });
    }
  },

  updateById: async (req, res) => {
    try {
      const id = req.params.id;
      if (id == req.manager._id)
        delete req.body.permission;

      //prevent password changing if not specified by user
      if (req.body.password == "" || req.body.password?.length < 4)
        delete req.body.password;

      await MangerModel.findByIdAndUpdate(id, req.body);

      return res.status(200).json({
        success: true,
        message: `מנהל עודכן בהצלחה`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `שגיאה בזמן עדכון מנהל`,
        error: error.message,
      });
    }
  },

  updateSelf: async (req, res) => {
    try {
      const id = req.manager.id;
      delete req.body.permission; //prevent editing self permission
      //prevent password changing if not specified by user
      if (req.body.password == "" || req.body.password.length < 4)
        delete req.body.password;

      await MangerModel.findByIdAndUpdate(id, req.body).exec();

      return res.status(200).json({
        success: true,
        message: `מנהל עודכן בהצלחה`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `שגיאה בזמן עדכון מנהל`,
        error: error.message,
      });
    }
  },

  deleteById: async (req, res) => {
    try {
      const id = req.params.id;
      if (id == req.manager._id)
        throw new Error("לא ניתן למחוק את עצמך..")

      await MangerModel.findByIdAndDelete(id).exec();

      return res.status(200).json({
        success: true,
        message: `מנהל נמחק בהצלחה`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `שגיאה בזמן מחיקת מנהל`,
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
          permission: manager.permission
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

  reqResetPassword: async (req, res) => {
    let timeLeft;
    try {
      const { email } = req.body;
      if (!email)
        throw new Error("לא הוזן אימייל")

      const manager = await MangerModel.findOne({ email });
      if (!manager)
        throw new Error("אמייל לא קיים במערכת");

      const olderOtp = await OtpModel.findOne({ email });
      if (olderOtp) {
        timeLeft = 5 * 60 - (Date.now() - olderOtp.createdAt) / 1000;
        throw new Error("בקשת איפוס כבר נשלחה כבר למייל שלך, יש לבדוק במייל..");
      }

      //gen rnd otp
      let otp;
      let result = true
      //cycle until we get an otp that is NOT in out DB
      while (result) {
        otp = otpGenerator.generate(6, { "specialChars": false });
        result = await OtpModel.findOne({ otp: otp });
      }

      //send email
      userResetPassword(manager.name, email, otp)


      //create new otp
      const otpObj = OtpModel({
        email,
        otp,
        userType: "manager"
      })
      otpObj.save();

      res.status(201).json({
        success: true,
        email,
        message: "קוד איפוס סיסמה נשלח למייל בהצלחה!",
      })

    } catch (e) {
      return res.status(401).json({
        message: "פעולה נכשלה",
        error: e.message,
        timeLeft
      })
    }
  },

  useResetPin: async (req, res) => {
    try {
      const { otp, password } = req.body;
      if (!otp)
        throw new Error("לא הוזן קוד איפוס")
      if (!password)
        throw new Error("לא הוזנה סיסמה חדשה לאיפוס")

      //get otp and delete after 
      const otpObj = await OtpModel.findOneAndDelete({ otp, userType: "manager" });
      if (!otpObj)
        throw new Error("קוד איפוס לא תקין או פג תוקף")

      //get that manager
      const manager = await MangerModel.findOne({ email: otpObj.email })
      if (!manager)
        throw new Error("המשתמש שמקושר לקוד הזה לא קיים יותר")

      //update the password
      manager.password = password;
      await manager.save();

      res.status(201).json({
        success: true,
        message: "סיסמה אופסה ועודכנה בהצלחה!"
      })

    } catch (e) {
      return res.status(401).json({
        message: "פעולה נכשלה",
        error: e.message
      })
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
      if (!manager)
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
          permission: manager.permission
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
