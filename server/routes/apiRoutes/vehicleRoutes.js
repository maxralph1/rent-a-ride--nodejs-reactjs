const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const vehicleController = require('../../controllers/vehicleController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.get('/:search', vehicleController.searchVehicles)

router.use(authenticated)

router.route('/')
        .get(checkRoles(roles.admin), vehicleController.getAllVehicles)
        .post(vehicleController.createVehicle);

router.get('/my-vehicles', vehicleController.getAuthUserVehicles),

router.get('/users/:user', vehicleController.getUserVehicles);

router.patch('/:vehicle/delete', vehicleController.softDeleteVehicle);

router.route('/:vehicle')
        .get(vehicleController.getVehicle)
        .put(vehicleController.updateVehicle)
        .patch(checkRoles(roles.admin), vehicleController.updateVehicleAdminLevel)
        .delete(checkRoles(roles.admin), vehicleController.deleteVehicle);

router.patch('/:vehicle/re-activate', checkRoles(roles.admin), vehicleController.reactivateSoftDeletedVehicle)


module.exports = router;