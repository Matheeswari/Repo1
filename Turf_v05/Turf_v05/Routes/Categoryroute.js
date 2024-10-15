const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/Categorymastercontroller');

// Define routes
router.get('/category', categoryController.getAllCategory);
router.get('/category/id/:categoryId', categoryController.getCategoryById);
router.post('/category/create', categoryController.createCategory);
router.post('/category/update/:categoryId', categoryController.updateCategoryById);
router.post('/category/delete/:categoryId', categoryController.deleteCategoryById);

router.get('/category/active', categoryController.getActiveCategory);
router.get('/category/active/:categoryId', categoryController.getActiveCategoryById);
router.get('/category/inactive', categoryController.getInactiveCategory);
router.get('/category/falsestatus', categoryController.getFalseStatusCategory);

module.exports = router;
