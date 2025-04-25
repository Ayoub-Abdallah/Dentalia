import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
export const getAllAppointments = async (req: Request, res: Response) => {
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
export const getAppointmentById = async (req: Request, res: Response) => {
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
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('patient', 'firstName lastName');
    
    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
export const updateAppointment = async (req: Request, res: Response) => {
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
export const deleteAppointment = async (req: Request, res: Response) => {
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
export const getAppointmentsByDate = async (req: Request, res: Response) => {
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
export const getAppointmentsByPatient = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate('patient', 'firstName lastName');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 