const otpGenerator = require('otp-generator');
const OtpModel = require(`../models/Otp`);

const { userResetPassword } = require("./email");

module.exports = {
    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {"manager"|"user"} userType 
     * @param {mongoose.Schema} userModel 
     * @returns 
     */
    async requestResetPassword(req, res, userType, userModel) {
        let timeLeft;
        try {
            const { email } = req.body;
            if (!email)
                throw new Error("לא הוזן אימייל")

            const user = await userModel.findOne({ email });
            if (!user)
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
            userResetPassword(user.name, email, otp)


            //create new otp
            const otpObj = OtpModel({
                email,
                otp,
                userType
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

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {"manager"|"user"} userType 
     * @param {mongoose.Schema} userModel 
     * @returns 
     */
    async useResetPin(req, res, userType, userModel) {
        try {
            const { otp, password } = req.body;
            if (!otp)
                throw new Error("לא הוזן קוד איפוס")
            if (!password)
                throw new Error("לא הוזנה סיסמה חדשה לאיפוס")

            //get otp and delete after 
            const otpObj = await OtpModel.findOneAndDelete({ otp, userType });
            if (!otpObj)
                throw new Error("קוד איפוס לא תקין או פג תוקף")

            //get that user
            const user = await userModel.findOne({ email: otpObj.email })
            if (!user)
                throw new Error("המשתמש שמקושר לקוד הזה לא קיים יותר")

            //update the password
            user.password = password;
            await user.save();

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
    }
}