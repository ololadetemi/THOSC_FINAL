const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    labRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'LabRequest', default: null },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testType: { type: String, required: true, enum: ['Lab', 'Radiology', 'Diagnostic', 'Other'] },
    testName: { type: String, required: true },
    result: { type: String },
    resultFile: { type: String },
    notes: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
