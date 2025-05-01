const Appointment = require('../models/Appointment');
const AppointmentType = require('../models/AppointmentType');
const asyncHandler = require('express-async-handler');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find()
    .populate('patient', 'firstName lastName')
    .populate('type', 'name duration color')
    .sort({ date: 1, startTime: 1 });
  res.json({ success: true, data: appointments });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'firstName lastName')
    .populate('type', 'name duration color');
    
    if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
    }
    
  res.json({ success: true, data: appointment });
});

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { patient, type, date, startTime, endTime, status, notes } = req.body;

  // Validate appointment type
  const appointmentType = await AppointmentType.findById(type);
  if (!appointmentType) {
    res.status(400);
    throw new Error('Invalid appointment type');
    }

  const appointment = await Appointment.create({
    patient,
    type,
    date,
    startTime,
    endTime,
    status,
    notes
  });
    
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patient', 'firstName lastName')
    .populate('type', 'name duration color');

  res.status(201).json({ success: true, data: populatedAppointment });
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const { patient, type, date, startTime, endTime, status, notes } = req.body;

  // Validate appointment type if it's being updated
  if (type) {
    const appointmentType = await AppointmentType.findById(type);
    if (!appointmentType) {
      res.status(400);
      throw new Error('Invalid appointment type');
    }
  }

  const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
    }
    
  appointment.patient = patient || appointment.patient;
  appointment.type = type || appointment.type;
  appointment.date = date || appointment.date;
  appointment.startTime = startTime || appointment.startTime;
  appointment.endTime = endTime || appointment.endTime;
  appointment.status = status || appointment.status;
  appointment.notes = notes || appointment.notes;

  const updatedAppointment = await appointment.save();

  const populatedAppointment = await Appointment.findById(updatedAppointment._id)
    .populate('patient', 'firstName lastName')
    .populate('type', 'name duration color');

  res.json({ success: true, data: populatedAppointment });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
    }

  await appointment.deleteOne();

  res.json({ success: true, data: {} });
});

// @desc    Get appointments by date
// @route   GET /api/appointments/date/:date
// @access  Private
const getAppointmentsByDate = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ date: req.params.date })
    .populate('patient', 'firstName lastName')
    .populate('type', 'name duration color')
    .sort({ startTime: 1 });
  res.json({ success: true, data: appointments });
});

// @desc    Get appointments by patient
// @route   GET /api/appointments/patient/:patientId
// @access  Private
const getAppointmentsByPatient = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ patient: req.params.patientId })
    .populate('patient', 'firstName lastName')
    .populate('type', 'name duration color')
    .sort({ date: -1, startTime: 1 });
  res.json({ success: true, data: appointments });
});

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDate,
  getAppointmentsByPatient
}; 