const nodeMailer = require("nodemailer");
 
exports.sendEmailWithNodemailer = (req, res, emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "zx8714245@gmail.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      pass: process.env.SEND_PASSWORD, // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
    },
    tls: {
      ciphers: "SSLv3",
    },
  });
 
  return transporter
    .sendMail(emailData)
    .then((info) => {
      console.log(`Message sent: ${info.response}`);
      return res.json({
        success: true,
      });
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));
};
 