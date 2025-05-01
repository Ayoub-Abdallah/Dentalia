const express = require('express');
const {
  getTreatments,
  getTreatment,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  addPayment,
  getPaymentHistory
} = require('../controllers/treatmentController');
const Treatment = require('../models/Treatment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Base routes
router
  .route('/')
  .get(protect, getTreatments)
  .post(protect, authorize('dentist', 'admin'), createTreatment);

router
  .route('/:id')
  .get(protect, getTreatment)
  .put(protect, authorize('dentist', 'admin'), updateTreatment)
  .delete(protect, authorize('dentist', 'admin'), deleteTreatment);

// Get treatments by patient ID
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    console.log('Fetching treatments for patient ID:', req.params.patientId);
    const treatments = await Treatment.find({ patient: req.params.patientId })
      .sort({ date: -1 });
    console.log('Found treatments:', treatments);
    res.status(200).json({ success: true, data: treatments });
  } catch (error) {
    console.error('Error fetching treatments by patient:', error);
    res.status(500).json({ success: false, error: 'Error fetching treatments' });
  }
});

// Payment routes
router.post('/:id/payments', protect, addPayment);
router.get('/:id/payments', protect, getPaymentHistory);

module.exports = router; 