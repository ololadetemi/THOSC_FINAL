const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');
const Payment = require('../models/paymentModel');
const Patient = require('../models/patientModel');

exports.createUser = async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        const newUser = new User({ name, email, role, password, createdBy: req.user._id });
        await newUser.save();
        res.status(201).json({ message: 'Staff account created successfully', user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, role }, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

exports.deactivateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User account deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

exports.recordPayment = async (req, res) => {
    const { patientId, cardNumber, amountExpected, amountPaid, method, notes } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        const newPayment = new Payment({ patient: patientId, recordedBy: req.user._id, cardNumber, amountExpected, amountPaid, method, notes });
        await newPayment.save();
        res.status(201).json({ message: 'Payment recorded successfully', payment: newPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error recording payment', error: error.message });
    }
};

exports.viewPayments = async (req, res) => {
    const { cardNumber } = req.query;
    try {
        let filter = {};
        if (cardNumber) {
            const patient = await Patient.findOne({ cardNumber });
            if (!patient) return res.status(404).json({ message: 'Patient not found' });
            filter.patient = patient._id;
        }
        const payments = await Payment.find(filter).populate('patient', 'patientName cardNumber').populate('recordedBy', 'name').sort({ date: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving payments', error: error.message });
    }
};

exports.viewAppointments = async (req, res) => {
    const { doctor, patientId, status } = req.query;
    try {
        let filter = {};
        if (patientId) filter.patient = patientId;
        if (doctor) filter.doctor = doctor;
        if (status) filter.status = status;
        const appointments = await Appointment.find(filter).populate('patient', 'patientName cardNumber').populate('doctor', 'name').populate('bookedBy', 'name role').sort({ appointmentDate: 1 });
        res.status(200).json({ message: 'Appointments retrieved', appointments });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

exports.getDashboardSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [totalPatients, todayAppointments, pendingPayments, paidToday] = await Promise.all([
            Patient.countDocuments(),
            Appointment.countDocuments({ appointmentDate: { $gte: today, $lt: tomorrow } }),
            Payment.countDocuments({ status: { $in: ['owing', 'part-payment'] } }),
            Payment.countDocuments({ status: 'paid', date: { $gte: today, $lt: tomorrow } })
        ]);
        res.status(200).json({ totalPatients, todayAppointments, pendingPayments, paidToday });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard summary', error: error.message });
    }
};
