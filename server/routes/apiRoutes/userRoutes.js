const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const authenticated = require('../../middleware/authenticated');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated)

router.route('/')
        .get(checkRoles(roles.admin), userController.getAllUsers)
        .post(checkRoles(roles.admin), userController.createUser);

router.get('/:searchKey', userController.searchUsers);

router.get('/:user/payments', userController.getUserPayments);

router.get('/:user/payments-made', userController.getUserPaymentsMade);

router.get('/:user/payments-received', userController.getUserPaymentsReceived);

router.get('/:user/vehicles', userController.getUserVehicles);

router.route('/:username')
        .get(userController.getUser)
        .post(userController.softDeleteUser)
        .delete(checkRoles(roles.admin), userController.deleteUser);

router.route('/:user')
        .patch(userController.softDeleteUser)
        .put(userController.updateUser);

router.patch('/:user/admin-update', checkRoles(roles.admin), userController.updateUserAdminLevel);

router.patch('/:user/reactivate', checkRoles(roles.admin), userController.reactivateSoftDeletedUser);


module.exports = router;