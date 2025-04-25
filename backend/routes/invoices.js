const express = require('express');
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPayment
} = require('../controllers/invoiceController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getInvoices)
  .post(protect, authorize('admin', 'staff'), createInvoice);

router
  .route('/:id')
  .get(protect, getInvoice)
  .put(protect, authorize('admin', 'staff'), updateInvoice)
  .delete(protect, authorize('admin'), deleteInvoice);

router
  .route('/:id/payments')
  .post(protect, authorize('admin', 'staff'), addPayment);

module.exports = router; 