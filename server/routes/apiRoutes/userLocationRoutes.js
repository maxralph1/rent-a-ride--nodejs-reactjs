const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const userLocationController = require('../../controllers/userLocationController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated)

router.get('/')
        .get(checkRoles(roles.admin), userLocationController.getAllUsersLocations)
        .post(userLocationController.addLatestUserLocation);

router.get('/users/:user', userLocationController.getAllCurrentUserLocations);

router.get('my-locations', userLocationController.getAllAuthUserLocations);

router.put('/:userLocation/delete', userLocationController.softDeleteUserLocation);

router.put('/:userLocation/re-activate', userLocationController.reactivateSoftDeletedUserLocation);

router.delete('/:userLocation', checkRoles(roles.admin), userLocationController.deleteUserLocation);


module.exports = router;