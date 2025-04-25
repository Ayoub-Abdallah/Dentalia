const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Create new appointment
router.post('/', appointmentController.createAppointment);

// Update appointment
router.put('/:id', appointmentController.updateAppointment);

// Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

// Get appointments by date
router.get('/date/:date', appointmentController.getAppointmentsByDate);

// Get appointments by patient
router.get('/patient/:patientId', appointmentController.getAppointmentsByPatient);

module.exports = router; 