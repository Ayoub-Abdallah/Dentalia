const AppointmentType = require('../models/AppointmentType');
const asyncHandler = require('express-async-handler');

// @desc    Get all appointment types
// @route   GET /api/appointment-types
// @access  Private
const getAppointmentTypes = asyncHandler(async (req, res) => {
  const appointmentTypes = await AppointmentType.find({ isActive: true })
    .sort({ name: 1 });
  res.json({ success: true, data: appointmentTypes });
});

// @desc    Create appointment type
// @route   POST /api/appointment-types
// @access  Private
const createAppointmentType = asyncHandler(async (req, res) => {
  const { name, description, duration, color } = req.body;

  if (!name || !duration) {
    res.status(400);
    throw new Error('Please provide name and duration');
  }

  const appointmentType = await AppointmentType.create({
    name,
    description,
    duration,
    color: color || '#3B82F6'
  });

  res.status(201).json({ success: true, data: appointmentType });
});

// @desc    Update appointment type
// @route   PUT /api/appointment-types/:id
// @access  Private
const updateAppointmentType = asyncHandler(async (req, res) => {
  const { name, description, duration, color, isActive } = req.body;

  const appointmentType = await AppointmentType.findById(req.params.id);

  if (!appointmentType) {
    res.status(404);
    throw new Error('Appointment type not found');
  }

  appointmentType.name = name || appointmentType.name;
  appointmentType.description = description || appointmentType.description;
  appointmentType.duration = duration || appointmentType.duration;
  appointmentType.color = color || appointmentType.color;
  appointmentType.isActive = isActive !== undefined ? isActive : appointmentType.isActive;

  const updatedAppointmentType = await appointmentType.save();

  res.json({ success: true, data: updatedAppointmentType });
});

// @desc    Delete appointment type
// @route   DELETE /api/appointment-types/:id
// @access  Private
const deleteAppointmentType = asyncHandler(async (req, res) => {
  const appointmentType = await AppointmentType.findById(req.params.id);

  if (!appointmentType) {
    res.status(404);
    throw new Error('Appointment type not found');
  }

  // Instead of deleting, we'll mark it as inactive
  appointmentType.isActive = false;
  await appointmentType.save();

  res.json({ success: true, data: {} });
});

module.exports = {
  getAppointmentTypes,
  createAppointmentType,
  updateAppointmentType,
  deleteAppointmentType
}; 