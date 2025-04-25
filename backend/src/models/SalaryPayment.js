const mongoose = require('mongoose');

const salaryPaymentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['monthly', 'advance', 'bonus']
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const SalaryPayment = mongoose.model('SalaryPayment', salaryPaymentSchema);

module.exports = SalaryPayment; 