const express = require('express');
const router = express.Router();
const userController = require('../Controllers/Usermastercontroller');

// Define routes
router.get('/users', userController.getAllUsers);
router.get('/users/id/:userId', userController.getUserById);
router.post('/users', userController.createUser);
router.post('/users/update/:userId', userController.updateUserById);
router.post('/users/delete/:userId', userController.deleteUserById);

router.get('/users/active', userController.getActiveUsers);
router.get('/users/active/:userId', userController.getActiveUserById);
router.get('/users/inactive', userController.getInactiveUsers);
router.get('/users/falsestatus', userController.getFalseStatusUsers);

module.exports = router;