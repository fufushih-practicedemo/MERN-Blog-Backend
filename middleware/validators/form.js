const {check} = require('express-validator')

exports.contactFormValidator = [
  check('name')
    .not().isEmpty()
    .withMessage('Name is required!!'),
  check('email')
    .not().isEmpty()
    .withMessage('Email is required!!'),
  check('message')
    .not().isEmpty()
    .isLength({min:20})
    .withMessage('Message must be at least 20 character!!'),
]