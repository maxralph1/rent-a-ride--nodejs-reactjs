const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const userLocationController = require('../../controllers/userLocationController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated)

router.get('/')
        .get(checkRoles(roles.admin), userLocationController.getAllUsersLocations);

router.route('/users/:user')
        .get(checkRoles(roles.admin), userLocationController.getAllCurrentUserLocations);

router.get('my-locations', userLocationController.getAllAuthUserLocations);

router.put('/:user/:userLocation/add-update', userLocationController.addUpdateUserLocation);

router.route('/:userLocation')
        .put(userLocationController.softDeleteUserLocation)
        .patch(checkRoles(roles.admin), userLocationController.reactivateSoftDeletedUserLocation)
        .delete(checkRoles(roles.admin), userLocationController.deleteUserLocation)


module.exports = router;