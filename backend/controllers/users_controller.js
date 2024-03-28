let UserModel = require(`../models/User`);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userTokenDuration = 1000 * 60 * 60 * 24 * 7; // 4d
const { requestResetPassword, useResetPin } = require("../utils/otpFlow")


module.exports = {
  // create new user
  create: async (req, res) => {
    try {
      // getting values from the body request
      const { name, email, password, phone, address } = req.body;
      console.log({ name, email, password, phone, address })
      // creating UserModel using the values from req.body
      const new_User = UserModel({
        name,
        email,
        password,
        phone: phone || "",
        address: address || "",
      });

      // actual saving
      await new_User.save();

      // return success message
      return res.status(200).json({
        success: true,
        message: `משתמש נוצר בהצלחה!`,
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: `לא היה ניתן ליצור משתמש`,
        error: error.message,
      });
    }
  },

  //login into user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user)
        throw new Error("אמייל או סיסמה לא תקינים");

      const equal = await bcrypt.compare(password, user.password);
      if (!equal)
        throw new Error("אמייל או סיסמה לא תקינים");

      // user login success
      let payload = { user: user._id };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: userTokenDuration });
      let oldTokens = user.tokens || [];
      //filter out all the token that expired from the DB
      if (oldTokens.length)
        oldTokens = oldTokens.filter(t => {
          //get lifetime  in sec
          const timeDiff = (Date.now() - ~~t.signedAt) / 1000;
          if (timeDiff < userTokenDuration)
            return t;
        });

      //update tokens list
      await UserModel.findByIdAndUpdate(user._id, { tokens: [...oldTokens, { token, signedAt: Date.now().toString() }] });

      res.cookie("token", token, { "maxAge": userTokenDuration, httpOnly: true })

      return res.status(201).json({
        success: true,
        message: "התחברת בהצלחה!",
        token,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "התחברות כשלה",
        error: error.message,
      });
    }
  },

  //logout from current user
  logout: async (req, res) => {
    try {
      const { token } = req;
      if (!token)
        return res.status(401).json({ success: false, message: 'בשביל להתנתק יש להתחבר תחילה' });

      const tokens = req.user.tokens;
      const newTokens = tokens.filter(t => t.token !== token);

      await UserModel.findByIdAndUpdate(req.user._id, { tokens: newTokens });

      res.clearCookie("token");
      return res.status(200).json({
        success: true,
        message: "התנתקת בהצלחה",
      });
    } catch (error) {
      return res.status(500).json({
        message: "בעייה בהתנתקות",
        error: error.message,
      });
    }
  },

  reqResetPassword: async (req, res) => {
    requestResetPassword(req, res, "user", UserModel)
  },

  useResetPin: async (req, res) => {
    useResetPin(req, res, "user", UserModel)
  },

  //auth current user and re create token
  authUserToken: async (req, res) => {
    try {
      //get token
      const { token } = req.cookies;
      if (!token)
        throw new Error("חסר טוקן משתמש בבקשה לשרת");

      //get data stored within token
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      //check that that user exists
      const user = await UserModel.findById(decode.user);
      if (!user)
        throw new Error("משתמש לא קיים");

      //check that current token is in the allowed tokens of that user (if not that token got logged out)
      const status = user.tokens.some((t) => t.token == token)
      if (!status)
        throw new Error("משתמש זה נותק - יש להתחבר מחדש")

      //user login refresh
      let payload = { user: user._id };
      const new_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: userTokenDuration });
      //filter out older (current)token
      const updatedTokens = user.tokens.filter((t) => t.token !== token);
      await UserModel.findByIdAndUpdate(user._id, {
        tokens: [...updatedTokens, { token: new_token, signedAt: Date.now().toString() }],
      });

      //send new token to client
      res.cookie("token", new_token, { "maxAge": userTokenDuration, httpOnly: true })

      return res.status(201).json({
        success: true,
        message: "משתמש אומת",
        token: new_token,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          cart: user.cart
        }
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

  //update for current logged in user
  update: async (req, res) => {
    try {
      const id = req.user;
      if (!id)
        throw new Error("לא נמצא מזהה משתמש תקין");

      if (req.body.password == "" || req.body.password?.length < 4)
        delete req.body.password;

      //limit the fields use can change as we can not trust the input (use might attempt to change token etc..)
      let { address, phone, password, email, name } = req.body
      let user = await UserModel.findByIdAndUpdate(id, { address, phone, password, email, name });
      user = { ...user, ...{ address, phone, password, email, name } }

      return res.status(200).json({
        success: true,
        message: `המשתמש עודכן בהצלחה`,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: `לא היה ניתן לעדכן את המשתמש`,
        error: error.message,
      });
    }
  },

  //delete current logged in user
  delete: async (req, res) => {
    try {
      const id = req.user;
      if (!id)
        throw new Error("לא התקבל מזהה משתמש תקין");

      await UserModel.findByIdAndDelete(id);

      res.clearCookie("token");

      return res.status(200).json({
        success: true,
        message: `משתמש נמחק בהצלחה`,
      });
    } catch (error) {
      return res.status(500).json({
        message: `לא היה ניתן למחוק את המשתמש`,
        error: error.message,
      });
    }
  },

  manage: {
    //get single user by id
    getById: async (req, res) => {
      const { id } = req.params
      try {
        if (!id)
          throw new Error("לא התקבל מזהה משתמש תקין");

        const user = await UserModel.findById(id).populate([
          //"cart",
          "orders.order",
        ]).exec();

        return res.status(200).json({
          success: true,
          message: `משתמש נשלף בהצלחה`,
          user,
        });
      } catch (error) {
        return res.status(400).json({
          message: `בעיה בשליפת משתמש עם המזהה: ${id}`,
          error: error.message,
        });
      }
    },

    //get all users
    getAll: async (req, res) => {
      try {
        const users = await UserModel.find();

        users.forEach(u => {
          u.password = undefined;
          u.tokens = undefined;
        })

        return res.status(200).json({
          success: true,
          message: `success to find all Users - for manager`,
          users,
        });
      } catch (error) {
        return res.status(500).json({
          message: `error in get all Users  - for manager`,
          error: error.message,
        });
      }
    },

    //delete a single user by id
    deleteById: async (req, res) => {
      //bind user id as the id request to delete
      req.user = req.params.id;
      module.exports.delete(req, res)
    },

    //update a user by id
    updateById: async (req, res) => {
      //bind user id as the id request to update
      req.user = req.params.id;
      module.exports.update(req, res)
    },
  }
};
