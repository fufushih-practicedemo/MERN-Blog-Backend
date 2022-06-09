// controllers/form.js
const { sendEmailWithNodemailer } = require("../helpers/email");
 
exports.contactForm = (req, res) => {
  console.log(req.body);
  const { name, email, message } = req.body;
 
  const emailData = {
    from: email, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
    to: process.env.EMAIL_TO, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
    subject: "Website Contact Form",
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
        <h4>Email received from contact form:</h4>
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://onemancode.com</p>
    `,
  };
 
  sendEmailWithNodemailer(req, res, emailData);
};

exports.contactBlogAuthorForm = (req, res) => {
  console.log(req.body);
  const { authorEmail, name, email, message } = req.body;

  let maillist = [authorEmail, process.env.EMAIL_TO]
 
  const emailData = {
    from: email, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
    to: maillist, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
    subject: `Website Contact Form - ${email} is message you`,
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
        <h4>Message received from contact form:</h4>
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://onemancode.com</p>
    `,
  };
 
  sendEmailWithNodemailer(req, res, emailData);
}