const Patient = require('../models/patientModel');
const Appointment = require('../models/appointmentModel');
const Result = require('../models/resultModel');
const LabRequest = require('../models/labRequestModel');
const User = require('../models/userModel');
const { Prescription } = require('../models/pharmacistModel');

// Any doctor can view all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find()
            .select('-doctorsNotes')
            .populate('assignedDoctor', 'name')
            .populate('registeredBy', 'name');
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
};

// Any doctor can view any patient's full profile
exports.getPatientProfile = async (req, res) => {
    const { patientId } = req.params;
    try {
        const patient = await Patient.findById(patientId).populate('assignedDoctor', 'name').populate('doctorsNotes.doctorId', 'name');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient profile', error: error.message });
    }
};

exports.addDoctorNote = async (req, res) => {
    const { patientId } = req.params;
    const { note } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        patient.doctorsNotes.push({ doctorId: req.user._id, note });
        await patient.save();
        res.status(200).json({ message: 'Note added successfully', notes: patient.doctorsNotes });
    } catch (error) {
        res.status(500).json({ message: 'Error adding note', error: error.message });
    }
};

// Only the doctor who wrote the note can edit it
exports.editDoctorNote = async (req, res) => {
    const { patientId, noteId } = req.params;
    const { note } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        const doctorsNote = patient.doctorsNotes.id(noteId);
        if (!doctorsNote) return res.status(404).json({ message: 'Note not found' });
        if (doctorsNote.doctorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to edit this note' });
        }
        doctorsNote.note = note;
        doctorsNote.date = Date.now();
        await patient.save();
        res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error: error.message });
    }
};

exports.saveAISummary = async (req, res) => {
    const { patientId, noteId } = req.params;
    const { aiSummary } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        const doctorsNote = patient.doctorsNotes.id(noteId);
        if (!doctorsNote) return res.status(404).json({ message: 'Note not found' });
        doctorsNote.aiSummary = aiSummary;
        await patient.save();
        res.status(200).json({ message: 'AI summary saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving AI summary', error: error.message });
    }
};

exports.requestLabTest = async (req, res) => {
    const { patientId, testName, instructions } = req.body;
    try {
        const labRequest = new LabRequest({ patient: patientId, requestedBy: req.user._id, testName, instructions });
        await labRequest.save();
        res.status(201).json({ message: 'Lab test requested successfully', labRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting lab test', error: error.message });
    }
};

exports.writePrescription = async (req, res) => {
    const { patientId, drugs } = req.body;
    try {
        const prescription = new Prescription({ patient: patientId, prescribedBy: req.user._id, drugs });
        await prescription.save();
        res.status(201).json({ message: 'Prescription written successfully', prescription });
    } catch (error) {
        res.status(500).json({ message: 'Error writing prescription', error: error.message });
    }
};

exports.viewPatientResults = async (req, res) => {
    const { patientId } = req.params;
    try {
        const patient = await Patient.findById(patientId).select('patientName cardNumber');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        const results = await Result.find({ patient: patientId }).populate('technician', 'name').sort({ date: -1 });
        res.status(200).json({ patient, results });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
};

exports.scheduleFollowUp = async (req, res) => {
    const { patientId, appointmentDate, reason } = req.body;
    try {
        const appointment = new Appointment({ patient: patientId, doctor: req.user._id, appointmentDate, reason: reason || 'Follow-up', bookedBy: req.user._id });
        await appointment.save();
        res.status(201).json({ message: 'Follow-up appointment scheduled', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling follow-up', error: error.message });
    }
};

exports.viewMyAppointments = async (req, res) => {
    const { status, date } = req.query;
    try {
        let filter = { doctor: req.user._id };
        if (status) filter.status = status;
        if (date) {
            const start = new Date(date); start.setHours(0, 0, 0, 0);
            const end = new Date(date); end.setHours(23, 59, 59, 999);
            filter.appointmentDate = { $gte: start, $lte: end };
        }
        const appointments = await Appointment.find(filter).populate('patient', 'patientName cardNumber').sort({ appointmentDate: 1 });
        res.status(200).json({ message: 'Appointments retrieved', appointments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};
// Returns list of all active doctors — accessible by any logged in user
exports.getDoctorsList = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', isActive: true })
            .select('name email');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};
