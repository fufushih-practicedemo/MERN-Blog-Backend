const express = require('express');
const router = express.Router()
const { create, list, read, remove } = require('../controllers/category');

// validators
const { runValidation } = require('../middleware/validators');
const { categoryCreateValidator } = require('../middleware/validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/category', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;