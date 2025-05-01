const express = require('express');
const router = express.Router();
const {
  getAppointmentTypes,
  createAppointmentType,
  updateAppointmentType,
  deleteAppointmentType
} = require('../controllers/appointmentTypeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAppointmentTypes)
  .post(protect, createAppointmentType);

router.route('/:id')
  .put(protect, updateAppointmentType)
  .delete(protect, deleteAppointmentType);

module.exports = router; 