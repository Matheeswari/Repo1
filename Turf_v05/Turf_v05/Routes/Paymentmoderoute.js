const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/Paymentmodemastercontroller');

// Define routes
router.get('/payments', paymentController.getAllPayments);
router.get('/payments/id/:paymentId', paymentController.getPaymentById);
router.post('/payments/create', paymentController.createPayment);
router.post('/payments/update/:paymentId', paymentController.updatePaymentById);
router.post('/payments/delete/:paymentId', paymentController.deletePaymentById);

router.get('/payments/active', paymentController.getActivePayments);
router.get('/payments/active/:paymentId', paymentController.getActivePaymentById);
router.get('/payments/inactive', paymentController.getInactivePayments);
router.get('/payments/falsestatus', paymentController.getFalseStatusPayments);

router.get('/payments/by-date/:date', paymentController.getPaymentsByDate);
module.exports = router;
