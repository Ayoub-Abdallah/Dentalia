const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a clinic name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
    maxlength: [20, 'Phone number cannot be more than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  workingHours: {
    monday: {
      type: String,
      default: '09:00 - 17:00'
    },
    tuesday: {
      type: String,
      default: '09:00 - 17:00'
    },
    wednesday: {
      type: String,
      default: '09:00 - 17:00'
    },
    thursday: {
      type: String,
      default: '09:00 - 17:00'
    },
    friday: {
      type: String,
      default: '09:00 - 17:00'
    },
    saturday: {
      type: String,
      default: '09:00 - 13:00'
    },
    sunday: {
      type: String,
      default: 'Closed'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
SettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', SettingsSchema); 