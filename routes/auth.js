const express = require('express')
const router = express.Router()
const { signup, signin, signout, requireSignin } = require('../controllers/auth')

// validators
const {runValidation} = require('../middleware/validators')
const {userSignupValidator, userSigninValidator} = require('../middleware/validators/auth')


router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);

// Test
// router.get('/secret', requireSignin, (req, res) => {
//   res.json({
//     // user: req.user
//     user: req.auth
//   })
// })

module.exports = router;