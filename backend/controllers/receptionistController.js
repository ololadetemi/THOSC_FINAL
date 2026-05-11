const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');

exports.createPatient = async (req, res) => {
    const { patientName, cardNumber, dateOfBirth, gender, contact, address, nextOfKinName, nextOfKinContact } = req.body;
    try {
        const existingPatient = await Patient.findOne({ cardNumber });
        if (existingPatient) return res.status(400).json({ message: 'A patient with this card number already exists' });
        const newPatient = new Patient({ patientName, cardNumber, dateOfBirth, gender, contact, address, nextOfKinName, nextOfKinContact, registeredBy: req.user._id });
        await newPatient.save();
        res.status(201).json({ message: 'Patient registered successfully', patient: newPatient });
    } catch (error) {
        res.status(500).json({ message: 'Error registering patient', error: error.message });
    }
};

exports.searchPatient = async (req, res) => {
    const { cardNumber, name } = req.query;
    try {
        let filter = {};
        if (cardNumber) filter.cardNumber = cardNumber;
        if (name) filter.patientName = { $regex: name, $options: 'i' };
        const patients = await Patient.find(filter).select('-doctorsNotes').populate('assignedDoctor', 'name');
        if (!patients || patients.length === 0) return res.status(404).json({ message: 'No patient found' });
        res.status(200).json({ message: 'Patients found', patients });
    } catch (error) {
        res.status(500).json({ message: 'Error searching for patient', error: error.message });
    }
};

exports.assignDoctor = async (req, res) => {
    const { patientId, doctorId } = req.body;
    try {
        const patient = await Patient.findByIdAndUpdate(patientId, { assignedDoctor: doctorId }, { new: true }).populate('assignedDoctor', 'name');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json({ message: 'Doctor assigned successfully', patient });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning doctor', error: error.message });
    }
};

exports.createAppointment = async (req, res) => {
    const { patientId, doctorId, appointmentDate, reason } = req.body;
    try {
        const newAppointment = new Appointment({ patient: patientId, doctor: doctorId, appointmentDate, reason, bookedBy: req.user._id });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment', error: error.message });
    }
};

exports.editAppointment = async (req, res) => {
    const { id } = req.params;
    const { appointmentDate, doctorId, reason } = req.body;
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, { appointmentDate, doctor: doctorId, reason }, { new: true });
        if (!updatedAppointment) return res.status(404).json({ message: 'Appointment not found' });
        res.status(200).json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
};

exports.cancelAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
    }
};

exports.viewAppointments = async (req, res) => {
    const { doctorId, patientId, status, date } = req.query;
    try {
        let filter = {};
        if (patientId) filter.patient = patientId;
        if (doctorId) filter.doctor = doctorId;
        if (status) filter.status = status;
        if (date) {
            const start = new Date(date); start.setHours(0, 0, 0, 0);
            const end = new Date(date); end.setHours(23, 59, 59, 999);
            filter.appointmentDate = { $gte: start, $lte: end };
        }
        const appointments = await Appointment.find(filter).populate('patient', 'patientName cardNumber').populate('doctor', 'name').sort({ appointmentDate: 1 });
        res.status(200).json({ message: 'Appointments retrieved', appointments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};
