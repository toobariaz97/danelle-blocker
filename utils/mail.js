const nodemailer = require("nodemailer");

const config = {
    service: "Gmail",
    port: "587",
    auth: {
        user: "richardsteve979@gmail.com",
        pass: "cjoxakbgaheprsvf",
    },
};
module.exports = {
    passwordReset: async(email, code) => {
        var transporter = nodemailer.createTransport(config);
        var mailOptions = {
            from: config.auth.user,
            to: email,
            subject: "Danyelle Blocker | password Reset",
            text: "",
            html: `<p> your code is ${code}:\n\n
            \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
            </p>`,
        };

        let resp = await transporter.sendMail(mailOptions);
        console.log("code from mailinator",mailOptions);
        return true;
    },
    send: async(email, subject, html) => {
        var transporter = nodemailer.createTransport(smtpConfiq);
        var mailOptions = {
            from: config.mail_from_address,
            to: email,
            subject,
            text: "",
            html,
        };
        let resp = await transporter.sendMail(mailOptions);
        return true;
    },
};