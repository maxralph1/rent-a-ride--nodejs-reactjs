const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const userLocationController = require('../../controllers/userLocationController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated)

router.route('/')
        .get(checkRoles(roles.admin), userLocationController.getAllUsersLocations)

router.get('/:user/:user-location', userLocationController.getAllCurrentUserLocations);

router.all('/:user/:user-location/add-update', checkRoles(roles.admin), userLocationController.addUpdateUserLocation)


module.exports = router;