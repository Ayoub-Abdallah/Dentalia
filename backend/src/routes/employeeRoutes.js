const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

// Employee routes
router.get('/', protect, employeeController.getAllEmployees);
router.get('/search', protect, employeeController.searchEmployees);
router.get('/:id', protect, employeeController.getEmployeeById);
router.post('/', protect, employeeController.createEmployee);
router.put('/:id', protect, employeeController.updateEmployee);
router.delete('/:id', protect, employeeController.deleteEmployee);

// Salary payment routes
router.get('/salary-payments', protect, employeeController.getAllSalaryPayments);
router.get('/salary-payments/employee/:employeeId', protect, employeeController.getSalaryPaymentsByEmployee);
router.post('/salary-payments', protect, employeeController.createSalaryPayment);

module.exports = router; 