const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  // dentist: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentHistory: [{
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    method: {
      type: String,
      enum: ['cash', 'credit_card', 'insurance', 'bank_transfer'],
      required: true
    },
    notes: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed'],
    default: 'planned'
  },
  notes: String
}, {
  timestamps: true
});

// Virtual for remaining balance
treatmentSchema.virtual('remainingBalance').get(function() {
  return this.cost - this.paidAmount;
});

// Method to add a payment
treatmentSchema.methods.addPayment = async function(amount, method, notes = '') {
  if (amount <= 0) {
    throw new Error('Payment amount must be greater than 0');
  }

  if (amount > this.remainingBalance) {
    throw new Error('Payment amount cannot exceed remaining balance');
  }

  this.paymentHistory.push({
    amount,
    method,
    notes,
    date: new Date()
  });

  this.paidAmount += amount;

  // If fully paid, update status to completed
  if (this.paidAmount >= this.cost) {
    this.status = 'completed';
  }

  return this.save();
};

module.exports = mongoose.model('Treatment', treatmentSchema); 