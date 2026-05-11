const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.post('/create-user', authenticate, authorize('admin'), adminController.createUser);
router.put('/update-user/:id', authenticate, authorize('admin'), adminController.updateUser);
router.put('/deactivate-user/:id', authenticate, authorize('admin'), adminController.deactivateUser);
router.delete('/delete-user/:id', authenticate, authorize('admin'), adminController.deleteUser);
router.get('/get-users', authenticate, authorize('admin'), adminController.getAllUsers);
router.get('/get-user/:id', authenticate, authorize('admin'), adminController.getUserById);
router.post('/payment', authenticate, authorize('admin'), adminController.recordPayment);
router.get('/payments', authenticate, authorize('admin'), adminController.viewPayments);
router.get('/appointments', authenticate, authorize('admin'), adminController.viewAppointments);
router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboardSummary);

module.exports = router;
