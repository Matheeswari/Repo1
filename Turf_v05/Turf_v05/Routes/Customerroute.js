const express = require('express');
const router = express.Router();
const customerController = require('../Controllers/Customermastercontroller');

// Define routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/id/:customerId', customerController.getCustomerById);
router.post('/customers/search', customerController.getCustomerBySearch);
router.post('/customers/create', customerController.createCustomer);
router.post('/customers/update/:customerId', customerController.updateCustomerById);
router.post('/customers/delete/:customerId', customerController.deleteCustomerById);

router.get('/customers/active', customerController.getActiveCustomers);
router.get('/customers/active/:customerId', customerController.getActiveCustomerById);
router.get('/customers/inactive', customerController.getInactiveCustomers);
router.get('/customers/falsestatus', customerController.getFalseStatusCustomers);

module.exports = router;
