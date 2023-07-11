const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const vehicleLocationController = require('../../controllers/vehicleLocationController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated)

router.route('/')
        .get(checkRoles(roles.admin), vehicleLocationController.getAllVehiclesLocations)

router.get('/users/:user', vehicleLocationController.getAllUserVehiclesLocations);

router.get('/auth', vehicleLocationController.getAllAuthUserVehiclesLocations);

router.get('/vehicles/:vehicle', vehicleLocationController.getAllCurrentVehicleLocations);

router.put('/:vehicle/:vehicleLocation/add-update', vehicleLocationController.addUpdateVehicleLocation);

router.route('/:vehicleLocation')
        .put(vehicleLocationController.softDeleteVehicleLocation)
        .patch(checkRoles(roles.admin), vehicleLocationController.reactivateSoftDeletedVehicleLocation)
        .delete(checkRoles(roles.admin), vehicleLocationController.deleteVehicleLocation)

// router.all('/:vehicle/:vehicle-location/add-update', checkRoles(roles.admin), vehicleLocationController)


module.exports = router;