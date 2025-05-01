const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
    required: [true, 'Age is required']
  },
  dateOfBirth: {
    type: String,
    required: [false, 'Date of birth is not required']
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  phone: {
    type: String,
    required: [false, 'Phone number is not required']
  },
  email: {
    type: String,
    required: [false, 'Email is not required'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  address: String,
  medicalHistory: String,
  dentalHistory: [{
    procedure: String,
    date: Date,
    notes: String
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  notes: String,
  allergies: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', patientSchema); 