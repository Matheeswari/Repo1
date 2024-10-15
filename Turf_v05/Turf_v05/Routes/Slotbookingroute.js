const express = require('express');
const router = express.Router();
const slotBookingController = require('../Controllers/Slotbookingmastercontroller');

// Define routes 
router.get('/slotbookings', slotBookingController.getAllSlotBookings);
router.get('/slotbookings/id/:bookingId', slotBookingController.getSlotBookingById);
router.post('/slotbookings/search', slotBookingController.getSlotBySearch);
router.post('/slotbookings/create', slotBookingController.createSlotBooking);
router.post('/slotbookings/update/:bookingId', slotBookingController.updateSlotpayById);
router.post('/slotbookings/delete/:bookingId', slotBookingController.deleteSlotBookingById);

router.get('/slotbookings/active', slotBookingController.getActiveSlotBookings);
router.get('/slotbookings/active/:bookingId', slotBookingController.getActiveSlotBookingById);
router.get('/slotbookings/inactive', slotBookingController.getInactiveSlotBookings);
router.get('/slotbookings/falsestatus', slotBookingController.getFalseStatusSlotBookings);

router.post('/slotbookings/checkoverlap', slotBookingController.checkOverlappingSlots);
router.get('/slotbookings/bybookingdate/:date', slotBookingController.getSlotBookingsByBookingDate);
router.get('/slotbookings/byslotdate/:date', slotBookingController.getSlotBookingsBySlotDate);

// Update the route definition
router.get('/slotbookings/bybookingrange/:startDate/:endDate', slotBookingController.getSlotBookingsByBookingRange);
router.get('/slotbookings/byslotrange/:startDate/:endDate', slotBookingController.getSlotBookingsBySlotRange);
router.get('/slotbookings/pendingpayment', slotBookingController.getSlotWithPendingBalance);
router.get('/slotbookings/paymentbyupdateddaterange?', slotBookingController.getPaymentsByUpdatedDateRange);
router.get('/slotbookings/paymentbypaiddaterange?', slotBookingController.getPaymentsByPaidDateRange);
router.get('/slotbookings/paymentbyupdateddatewise/:date', slotBookingController.getPaymentsByUpdatedDatewise);
router.get('/slotbookings/paymentbypaiddatewise/:date', slotBookingController.getPaymentsByPaidDatewise);
router.get('/slotbookings/withoutpay/id/:bookingId', slotBookingController.getwithoutpaymentById);
router.get('/slotbookings/withoutpay', slotBookingController.getallwithoutpayment);
router.post('/slotbookings/updateslot/:bookingId', slotBookingController.updateSlotById);

//only payment details 
router.get('/slotbookings/onlypayment', slotBookingController.getallpayment);
router.get('/slotbookings/paymentreport', slotBookingController.paymentreport);

module.exports = router;
