const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const pharmacistController = require('../controllers/pharmacistController');

router.get('/pending-prescriptions', authenticate, authorize('pharmacist'), pharmacistController.getPendingPrescriptions);
router.put('/dispense/:id', authenticate, authorize('pharmacist'), pharmacistController.dispensePrescription);
router.get('/inventory', authenticate, authorize('pharmacist'), pharmacistController.getInventory);
router.post('/add-drug', authenticate, authorize('pharmacist'), pharmacistController.addDrug);
router.put('/update-stock/:id', authenticate, authorize('pharmacist'), pharmacistController.updateStock);

module.exports = router;
