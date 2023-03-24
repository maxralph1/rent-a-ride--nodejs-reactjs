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

router.get('/:search', checkRoles(roles.admin), userController.searchUsers);

router.get('/:user/vehicles', userController.getUserVehicles);

router.route('/:user')
        .get(userController.getUser)
        .patch(userController.softDeleteUser)
        .put(userController.updateUser)
        .delete(checkRoles(roles.admin), userController.deleteUser);

router.patch('/:user/update', checkRoles(roles.admin), userController.updateUserAdminLevel);

router.patch('/:user/reactivate', checkRoles(roles.admin), userController.reactivateSoftDeletedUser);


module.exports = router;