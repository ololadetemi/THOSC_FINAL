const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const labController = require('../controllers/labController');
const upload = require('../config/multerConfig');

router.get('/pending-requests', authenticate, authorize('lab_technician'), labController.getPendingRequests);
router.post('/add-result', authenticate, authorize('lab_technician'), upload.single('resultFile'), labController.addLabResult);
router.put('/edit-result/:id', authenticate, authorize('lab_technician'), upload.single('resultFile'), labController.editResult);
router.get('/my-results', authenticate, authorize('lab_technician'), labController.getMyResults);

module.exports = router;
