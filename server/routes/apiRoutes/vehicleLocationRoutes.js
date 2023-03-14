const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const vehicleLocationController = require('../../controllers/vehicleLocationController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated)

router.route('/')
        .get(checkRoles(roles.admin), vehicleLocationController.getAllVehiclesLocations)

router.get('/:vehicle/:vehicle-location', vehicleLocationController.getAllCurrentVehicleLocations);

router.all('/:vehicle/:vehicle-location/add-update', checkRoles(roles.admin), vehicleLocationController.addUpdateVehicleLocation)


module.exports = router;