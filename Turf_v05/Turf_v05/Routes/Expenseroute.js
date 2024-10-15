const express = require('express');
const router = express.Router();
const expenseController = require('../Controllers/Expensemastercontroller');

// Define routes
router.get('/expenses', expenseController.getAllExpenses);
router.get('/expenses/active', expenseController.getActiveExpenses);
router.get('/expenses/active/:expenseId', expenseController.getActiveExpenseById);
router.get('/expenses/inactive', expenseController.getInactiveExpenses);
router.get('/expenses/falsestatus', expenseController.getFalseStatusExpenses);
router.get('/expenses/id/:expenseId', expenseController.getExpenseById);
router.post('/expenses/create', expenseController.createExpense);
router.post('/expenses/search', expenseController.getexpenseBySearch);
router.post('/expenses/update/:expenseId', expenseController.updateExpenseById);
router.post('/expenses/delete/:expenseId', expenseController.deleteExpenseById);
router.get('/expenses/by-date/:date', expenseController.expenseBydate);
router.get('/expenses/by-date-range/:startDate/:endDate', expenseController.expensesByDateRange);
module.exports = router;