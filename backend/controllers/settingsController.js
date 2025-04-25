const Settings = require('../models/Settings');
const asyncHandler = require('express-async-handler');

// @desc    Get clinic settings
// @route   GET /api/settings
// @access  Private
const getSettings = asyncHandler(async (req, res) => {
  // Get the first settings document or create one if it doesn't exist
  let settings = await Settings.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await Settings.create({
      name: 'Dentalia Clinic',
      address: '123 Main St',
      phone: '(555) 123-4567',
      email: 'info@dentalia.com',
      workingHours: {
        monday: '09:00 - 17:00',
        tuesday: '09:00 - 17:00',
        wednesday: '09:00 - 17:00',
        thursday: '09:00 - 17:00',
        friday: '09:00 - 17:00',
        saturday: '09:00 - 13:00',
        sunday: 'Closed'
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update clinic settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
  // Get the first settings document or create one if it doesn't exist
  let settings = await Settings.findOne();
  
  if (!settings) {
    // Create new settings if none exist
    settings = await Settings.create(req.body);
  } else {
    // Update existing settings
    settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, runValidators: true }
    );
  }
  
  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Create clinic settings
// @route   POST /api/settings
// @access  Private
const createSettings = asyncHandler(async (req, res) => {
  // Check if settings already exist
  const existingSettings = await Settings.findOne();
  
  if (existingSettings) {
    res.status(400);
    throw new Error('Settings already exist. Use PUT to update.');
  }
  
  // Create new settings
  const settings = await Settings.create(req.body);
  
  res.status(201).json({
    success: true,
    data: settings
  });
});

module.exports = {
  getSettings,
  updateSettings,
  createSettings
}; 