const Employee = require('../models/Employee');
const SalaryPayment = require('../models/SalaryPayment');
const Financial = require('../models/Financial');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = asyncHandler(async (req, res, next) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: employees });
});

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: employee });
});

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
exports.createEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.create(req.body);
  res.status(201).json({ success: true, data: employee });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: employee });
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get all salary payments
// @route   GET /api/employees/salary-payments
// @access  Private
exports.getAllSalaryPayments = asyncHandler(async (req, res, next) => {
  const payments = await SalaryPayment.find().populate('employeeId');
  res.status(200).json({ success: true, data: payments });
});

// @desc    Get salary payments by employee
// @route   GET /api/employees/salary-payments/employee/:employeeId
// @access  Private
exports.getSalaryPaymentsByEmployee = asyncHandler(async (req, res, next) => {
  const payments = await SalaryPayment.find({ employeeId: req.params.employeeId })
    .populate('employeeId');
  res.status(200).json({ success: true, data: payments });
});

// @desc    Create salary payment
// @route   POST /api/employees/salary-payments
// @access  Private
exports.createSalaryPayment = asyncHandler(async (req, res, next) => {
  // Create the salary payment
  const payment = await SalaryPayment.create(req.body);
  
  // Update employee's payment status
  await Employee.findByIdAndUpdate(req.body.employeeId, {
    paymentStatus: 'paid'
  });

  // Create corresponding financial expense record
  const employee = await Employee.findById(req.body.employeeId);
  const financialExpense = await Financial.create({
    type: 'expense',
    amount: req.body.amount,
    description: `Salary payment for ${employee.firstName} ${employee.lastName}`,
    category: 'salary',
    date: req.body.paymentDate,
    createdBy: req.user.id,
    notes: `Payment type: ${req.body.type}, Method: ${req.body.paymentMethod}`
  });
  
  res.status(201).json({ 
    success: true, 
    data: {
      payment,
      financialExpense
    }
  });
}); 