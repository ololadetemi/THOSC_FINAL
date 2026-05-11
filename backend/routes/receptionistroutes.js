const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const receptionistController = require('../controllers/receptionistController');

router.post('/create-patient', authenticate, authorize('receptionist'), receptionistController.createPatient);
router.get('/search-patient', authenticate, authorize('receptionist'), receptionistController.searchPatient);
router.put('/assign-doctor', authenticate, authorize('receptionist'), receptionistController.assignDoctor);
router.post('/create-appointment', authenticate, authorize('receptionist'), receptionistController.createAppointment);
router.put('/edit-appointment/:id', authenticate, authorize('receptionist'), receptionistController.editAppointment);
router.put('/cancel-appointment/:id', authenticate, authorize('receptionist'), receptionistController.cancelAppointment);
router.get('/appointments', authenticate, authorize('receptionist'), receptionistController.viewAppointments);

module.exports = router;
