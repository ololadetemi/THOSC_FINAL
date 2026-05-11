const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    cardNumber: { type: Number, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    nextOfKinName: { type: String, required: true },
    nextOfKinContact: { type: String, required: true },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorsNotes: [
        {
            doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            note: { type: String, required: true },
            aiSummary: { type: String, default: null },
            date: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
