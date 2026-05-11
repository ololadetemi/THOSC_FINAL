const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    drugs: [
        {
            drugName: { type: String, required: true },
            dosage: { type: String, required: true },
            duration: { type: String, required: true },
            notes: { type: String, default: null }
        }
    ],
    status: { type: String, enum: ['pending', 'dispensed'], default: 'pending' },
    dispensedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    dispensedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

const drugInventorySchema = new mongoose.Schema({
    drugName: { type: String, required: true },
    quantityInStock: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
const DrugInventory = mongoose.model('DrugInventory', drugInventorySchema);

module.exports = { Prescription, DrugInventory };
