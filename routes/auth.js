const express = require('express')
const router = express.Router()
const { 
  signup, 
  signin, 
  signout, 
  forgotPassword, 
  resetPassword, 
  preSignup 
} = require('../controllers/auth')

// validators
const {runValidation} = require('../middleware/validators')
const {
  userSignupValidator, 
  userSigninValidator, 
  forgotPasswordValidator, 
  resetPasswordValidator, 
} = require('../middleware/validators/auth')

router.post('/pre-signup', userSignupValidator, runValidation, preSignup);
// router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signup', signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword)

// Test
// router.get('/secret', requireSignin, (req, res) => {
//   res.json({
//     // user: req.user
//     user: req.auth
//   })
// })

module.exports = router;