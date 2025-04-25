const express = require('express');
const {
  getTreatments,
  getTreatment,
  createTreatment,
  updateTreatment,
  deleteTreatment
} = require('../controllers/treatmentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getTreatments)
  .post(protect, authorize('dentist', 'admin'), createTreatment);

router
  .route('/:id')
  .get(protect, getTreatment)
  .put(protect, authorize('dentist', 'admin'), updateTreatment)
  .delete(protect, authorize('dentist', 'admin'), deleteTreatment);

module.exports = router; 