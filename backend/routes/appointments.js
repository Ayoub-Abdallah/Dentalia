const express = require('express');
const { check, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'firstName lastName')
      .sort({ date: 1, startTime: 1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/appointments
// @desc    Create an appointment
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('patient', 'Patient is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('startTime', 'Start time is required').not().isEmpty(),
      check('endTime', 'End time is required').not().isEmpty(),
      check('type', 'Appointment type is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check for scheduling conflicts
      // const existingAppointment = await Appointment.findOne({
       
      //   date: req.body.date,
      //   $or: [
      //     {
      //       startTime: { $lt: req.body.endTime },
      //       endTime: { $gt: req.body.startTime }
      //     }
      //   ]
      // });

      // if (existingAppointment) {
      //   return res.status(400).json({ msg: 'Time slot is already booked' });
      // }

      const appointment = new Appointment(req.body);
      await appointment.save();
      res.json(appointment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update an appointment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    // Check for scheduling conflicts
    if (req.body.date || req.body.startTime || req.body.endTime) {
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        date: req.body.date || (await Appointment.findById(req.params.id)).date,
        $or: [
          {
            startTime: { $lt: req.body.endTime || (await Appointment.findById(req.params.id)).endTime },
            endTime: { $gt: req.body.startTime || (await Appointment.findById(req.params.id)).startTime }
          }
        ]
      });

      if (existingAppointment) {
        return res.status(400).json({ msg: 'Time slot is already booked' });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('patient', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    await appointment.remove();
    res.json({ msg: 'Appointment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 