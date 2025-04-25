const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'firstName lastName');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Public
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
exports.createAppointment = async (req, res) => {
  try {
    console.log('Create Appointment Request Body:', req.body);
    
    // Validate patient ID
    if (!req.body.patient) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    // Validate treatment plan ID if provided
    if (req.body.treatmentPlan && !mongoose.Types.ObjectId.isValid(req.body.treatmentPlan)) {
      return res.status(400).json({ message: 'Invalid treatment plan ID' });
    }

    const appointment = new Appointment(req.body);
    console.log('Created Appointment Object:', appointment);
    
    const savedAppointment = await appointment.save();
    console.log('Saved Appointment:', savedAppointment);
    
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('patient', 'firstName lastName');
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('patient', 'firstName lastName');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments by date
// @route   GET /api/appointments/date/:date
// @access  Public
exports.getAppointmentsByDate = async (req, res) => {
  try {
    const appointments = await Appointment.find({ date: req.params.date })
      .populate('patient', 'firstName lastName');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments by patient
// @route   GET /api/appointments/patient/:patientId
// @access  Public
exports.getAppointmentsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate('patient', 'firstName lastName');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 