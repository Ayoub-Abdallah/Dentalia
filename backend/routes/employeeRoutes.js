const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllSalaryPayments,
  getSalaryPaymentsByEmployee,
  createSalaryPayment
} = require('../controllers/employeeController');

// Protect all routes
const { protect } = require('../middleware/auth');

router.use(protect);

// Employee routes
router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

// Salary payment routes
router.get('/salary-payments', getAllSalaryPayments);
router.get('/salary-payments/employee/:employeeId', getSalaryPaymentsByEmployee);
router.post('/salary-payments', createSalaryPayment);

module.exports = router; 