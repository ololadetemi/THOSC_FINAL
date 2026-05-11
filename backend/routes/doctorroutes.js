const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const doctorController = require('../controllers/doctorController');

router.get('/all-patients', authenticate, authorize('doctor'), doctorController.getAllPatients);
router.get('/patient/:patientId', authenticate, authorize('doctor'), doctorController.getPatientProfile);
router.post('/add-note/:patientId', authenticate, authorize('doctor'), doctorController.addDoctorNote);
router.put('/edit-note/:patientId/:noteId', authenticate, authorize('doctor'), doctorController.editDoctorNote);
router.put('/ai-summary/:patientId/:noteId', authenticate, authorize('doctor'), doctorController.saveAISummary);
router.post('/request-lab', authenticate, authorize('doctor'), doctorController.requestLabTest);
router.post('/prescription', authenticate, authorize('doctor'), doctorController.writePrescription);
router.get('/results/:patientId', authenticate, authorize('doctor'), doctorController.viewPatientResults);
router.post('/follow-up', authenticate, authorize('doctor'), doctorController.scheduleFollowUp);
router.get('/appointments', authenticate, authorize('doctor'), doctorController.viewMyAppointments);
router.get('/list', authenticate, doctorController.getDoctorsList);

module.exports = router;
