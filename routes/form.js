const express = require('express')
const router = express.Router()
const {contactForm, contactBlogAuthorForm} = require('../controllers/form')

// validator
const {runValidation} = require('../middleware/validators')
const {contactFormValidator} = require('../middleware/validators/form')

router.post('/contact', contactFormValidator, runValidation, contactForm)
router.post('/contact-blog-author', contactFormValidator, runValidation, contactBlogAuthorForm)

module.exports = router