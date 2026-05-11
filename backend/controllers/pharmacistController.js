const { Prescription, DrugInventory } = require('../models/pharmacistModel');

exports.getPendingPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ status: 'pending' }).populate('patient', 'patientName cardNumber').populate('prescribedBy', 'name').sort({ createdAt: -1 });
        res.status(200).json({ message: 'Pending prescriptions retrieved', prescriptions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
    }
};

exports.dispensePrescription = async (req, res) => {
    const { id } = req.params;
    try {
        const prescription = await Prescription.findByIdAndUpdate(id, { status: 'dispensed', dispensedBy: req.user._id, dispensedAt: new Date() }, { new: true });
        if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
        res.status(200).json({ message: 'Prescription marked as dispensed', prescription });
    } catch (error) {
        res.status(500).json({ message: 'Error dispensing prescription', error: error.message });
    }
};

exports.getInventory = async (req, res) => {
    try {
        const inventory = await DrugInventory.find().sort({ drugName: 1 });
        res.status(200).json({ message: 'Inventory retrieved', inventory });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory', error: error.message });
    }
};

exports.addDrug = async (req, res) => {
    const { drugName, quantityInStock, unit } = req.body;
    try {
        const drug = new DrugInventory({ drugName, quantityInStock, unit, updatedBy: req.user._id });
        await drug.save();
        res.status(201).json({ message: 'Drug added to inventory', drug });
    } catch (error) {
        res.status(500).json({ message: 'Error adding drug', error: error.message });
    }
};

exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { quantityInStock } = req.body;
    try {
        const drug = await DrugInventory.findByIdAndUpdate(id, { quantityInStock, lastUpdated: new Date(), updatedBy: req.user._id }, { new: true });
        if (!drug) return res.status(404).json({ message: 'Drug not found' });
        res.status(200).json({ message: 'Stock updated successfully', drug });
    } catch (error) {
        res.status(500).json({ message: 'Error updating stock', error: error.message });
    }
};
