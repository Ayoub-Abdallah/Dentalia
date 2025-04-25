const mongoose = require('mongoose');

const FinancialSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please specify the type of transaction'],
    enum: ['income', 'expense'],
    default: 'income'
  },
  amount: {
    type: Number,
    required: [true, 'Please provide the amount'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify the category'],
    enum: [
      'consultation',
      'treatment',
      'medication',
      'equipment',
      'salary',
      'rent',
      'utilities',
      'maintenance',
      'other'
    ]
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Financial', FinancialSchema); 