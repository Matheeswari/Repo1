const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/Adminmastercontroller');

// Define routes
router.get('/admins', adminController.getAllAdmins);
router.post('/admins/create', adminController.createAdmin);
router.post('/admins/update/:adminId', adminController.updateAdminById);
router.post('/admins/delete/:adminId', adminController.deleteAdminById);
router.post('/admins/loginadmin', adminController.loginadmin);
router.get('/admins/active', adminController.getActiveAdmins);
router.get('/admins/active/:adminId', adminController.getActiveAdminById);
router.get('/admins/inactive', adminController.getInactiveAdmins);
router.get('/admins/falsestatus', adminController.getFalseStatusAdmins);
router.get('/admins/id/:adminId', adminController.getAdminByAdminId);

module.exports = router;