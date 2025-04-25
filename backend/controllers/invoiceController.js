const Invoice = require('../models/Invoice');
const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find()
    .populate('patient', 'name email')
    .populate('treatments.treatment', 'type description cost');
  res.status(200).json({ success: true, data: invoices });
});

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
const getInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('patient', 'name email')
    .populate('treatments.treatment', 'type description cost');

  if (!invoice) {
    return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: invoice });
});

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.create(req.body);
  res.status(201).json({ success: true, data: invoice });
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = asyncHandler(async (req, res, next) => {
  let invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
  }

  invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: invoice });
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
  }

  await invoice.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Add payment to invoice
// @route   POST /api/invoices/:id/payments
// @access  Private
const addPayment = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
  }

  const { amount, method } = req.body;

  // Add payment to history
  invoice.paymentHistory.push({
    amount,
    method
  });

  // Update paid amount
  invoice.paidAmount += amount;

  // Update status
  if (invoice.paidAmount >= invoice.totalAmount) {
    invoice.status = 'paid';
  } else if (invoice.paidAmount > 0) {
    invoice.status = 'partial';
  }

  await invoice.save();
  res.status(200).json({ success: true, data: invoice });
});

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPayment
}; 