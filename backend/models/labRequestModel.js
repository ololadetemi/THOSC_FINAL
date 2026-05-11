const mongoose = require('mongoose');

const labRequestSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testName: { type: String, required: true },
    instructions: { type: String, default: null },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    resultId: { type: mongoose.Schema.Types.ObjectId, ref: 'Result', default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LabRequest', labRequestSchema);
