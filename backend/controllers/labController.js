const Result = require('../models/resultModel');
const LabRequest = require('../models/labRequestModel');
const upload = require('../config/multerConfig');

exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await LabRequest.find({ status: 'pending' }).populate('patient', 'patientName cardNumber').populate('requestedBy', 'name').sort({ createdAt: 1 });
        res.status(200).json({ message: 'Pending lab requests retrieved', requests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lab requests', error: error.message });
    }
};

exports.addLabResult = async (req, res) => {
    const { labRequestId, patientId, testName, testType, result, notes } = req.body;
    try {
        const newResult = new Result({
            patient: patientId, labRequest: labRequestId || null, technician: req.user._id,
            testType: testType || 'Lab', testName, result,
            resultFile: req.file ? `/uploads/results/${req.file.filename}` : null, notes
        });
        await newResult.save();
        if (labRequestId) await LabRequest.findByIdAndUpdate(labRequestId, { status: 'completed', resultId: newResult._id });
        res.status(201).json({ message: 'Result uploaded successfully', result: newResult });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading result', error: error.message });
    }
};

exports.editResult = async (req, res) => {
    const { id } = req.params;
    const { testName, result, notes } = req.body;
    try {
        const updatedResult = await Result.findByIdAndUpdate(id, { testName, result, notes, ...(req.file && { resultFile: `/uploads/results/${req.file.filename}` }) }, { new: true });
        if (!updatedResult) return res.status(404).json({ message: 'Result not found' });
        res.status(200).json({ message: 'Result updated successfully', result: updatedResult });
    } catch (error) {
        res.status(500).json({ message: 'Error updating result', error: error.message });
    }
};

exports.getMyResults = async (req, res) => {
    try {
        const results = await Result.find({ technician: req.user._id }).populate('patient', 'patientName cardNumber').sort({ date: -1 });
        res.status(200).json({ message: 'Results retrieved', results });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
};
