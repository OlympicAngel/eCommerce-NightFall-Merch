const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = {

    /**
 * @param {*} to 
 * @param {User} user 
 */
    async userResetPassword(name, email, code) {
        const mailOptions = {
            to: `"${email}"`,
            subject: "נייטפול מרצ' - בקשת איפוס סיסמה",
            html: `<div class="container" style="color:#fff;text-shadow: 0.05em 0.1em #000; font-size: 1.2em; font-family: Arial, Helvetica, sans-serif; background: #232323; color: #fff; width: 100%; height: 100%; margin: 0; display: flex; align-items: center; justify-content: center; text-align: center;">
<div class="warp" style="padding: 1.5em; box-shadow: 0 0.5em 1em -0.3em #000; border: #7734c6 1px solid; border-radius: 0.5em; width: clamp(300px,70vw,1200px); direction: rtl; margin:1em;">
<h2 style="margin: 0; padding: 0; font-size: 1.6em; color: #7734c6;">הליך איפוס סיסמה:</h2>
<p>
${name}, התקבלה בקשה לאיפוס הסיסמה בחשבון שלך, <b>במידה ולא אתה ביקשת יש להתעלם מהמייל הזה</b>,
<br>
אם כן ביקשת לאפס את הסיסמה שלך יש להזין את הקוד הבא:
</p>
<div style="font-size:1.2em; width:min-content; border-radius: 0.5em; padding:0.3em 1em; background: #000;letter-spacing:0.07em;margin: auto;">
${code}</div>
</div>
</div>`
        };
        transporter.sendMail(mailOptions).then().catch(console.log)
    }
};