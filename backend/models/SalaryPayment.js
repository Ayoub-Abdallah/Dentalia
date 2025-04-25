const mongoose = require('mongoose');

const SalaryPaymentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required']
  },
  type: {
    type: String,
    enum: ['monthly', 'advance', 'bonus'],
    required: [true, 'Payment type is required']
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'check'],
    required: [true, 'Payment method is required']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SalaryPayment', SalaryPaymentSchema); 