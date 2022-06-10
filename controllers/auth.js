const User = require('../models/user')
const Blog = require('../models/blog')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')
const {errorHandler} = require('../helpers/dbErrorHandler')
const _ = require('lodash');
const nodeMailer = require("nodemailer");

exports.signup = (req, res) => {
  User.findOne({email: req.body.email}).exec((err, user) => {
    if(user) {
      return res.status(400).json({
        error: 'Email is taken'
      })
    }

    const {name, email, password} = req.body;
    let username = shortId.generate()
    let profile = `${process.env.CLIENT_URL}/profile/${username}`

    let newUser = new User({name, email, password, profile, username})    
    newUser.save((err, success) => {
      if(err) {
        return res.status(400).json({
          error: err
        })
      }
      // res.json({
      //   user: success
      // })
      res.json({
        message: 'Signup success! Please signin'
      })
    })
  })
}

exports.signin = (req, res) => {
  const {email, password} = req.body

  User.findOne({email}).exec((err, user) => {
    // Check exist
    if(err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please Signup.'
      });
    }

    // authenticate
    if(!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match.'
      });
    }
    // generate token
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
    res.cookie('token', token, {expiresIn: '1d'});
    const {_id, username, name, email, role} = user;
    return res.json({
      token,
      user: {
        _id, username, name, email, role
      }
    });
  })
}

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'Signout success'
  })
}

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.auth._id
  User.findById({_id: authUserId}).exec((err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: 'User not found'
      })
    }

    req.profile = user
    next()
  })
}

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.auth._id
  User.findById({_id: adminUserId}).exec((err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: 'User not found'
      })
    }

    if(user.role !== 1) {
      return res.status(400).json({
        error: 'Admin resource. Access denied'
      })
    }

    req.profile = user
    next()
  })
}

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      }
      let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString();
      if (!authorizedUser) {
          return res.status(400).json({
              error: 'You are not authorized'
          });
      }
      next();
  });
};

exports.forgotPassword = (req, res) => {
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

  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email does not exist'
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

    // email
    const emailData = {
      from: process.env.EMAIL_FROM, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
      subject: "Password reset link",
      html: `
        <p>Please use the following link to reset your password:</p>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <hr />
        <p>This email may contain sensetive information</p>
        <p>https://seoblog.com</p>
      `,
    };
    // populating the db > user > resetPasswordLink
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        transporter
          .sendMail(emailData)
          .then((info) => {
            console.log(`Message sent: ${info.response}`);
            return res.json({
              message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
            });
          })
          .catch((err) => console.log(`Problem sending email: ${err}`));
      }
    });
  });
}

exports.resetPassword = (req, res) => {
  const {resetPasswordLink, newPassword} = req.body

  if(resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
      if(err) {
        return res.status(401).json({
          error: 'Expired link. Try again'
        })
      }

      User.findOne({resetPasswordLink}, (err, user) => {
        if (err || !user) {
          return res.status(401).json({
            error: 'Something went wrong. Try later'
          });
        }
        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ''
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err)
            });
          }
          res.json({
            message: `Great! Now you can login with your new password`
          });
        });
      })
    })
  }
}