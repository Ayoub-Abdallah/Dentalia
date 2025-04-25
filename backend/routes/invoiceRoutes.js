const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPayment
} = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

// Get all invoices
router.get('/', getInvoices);

// Get single invoice
router.get('/:id', getInvoice);

// Create new invoice
router.post('/', authorize('admin', 'staff'), createInvoice);

// Update invoice
router.put('/:id', authorize('admin', 'staff'), updateInvoice);

// Add payment
router.post('/:id/payments', authorize('admin', 'staff'), addPayment);

// Delete invoice
router.delete('/:id', authorize('admin'), deleteInvoice);

module.exports = router; 