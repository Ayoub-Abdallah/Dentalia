const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  // dentist: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
  // ,
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppointmentType',
    required: [true, 'Appointment type is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Add index for efficient querying
appointmentSchema.index({ date: 1, startTime: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ type: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema); 