const mongoose = require('mongoose');

const appointmentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Appointment type name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Duration is required'],
    min: [5, 'Duration must be at least 5 minutes']
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AppointmentType', appointmentTypeSchema); 