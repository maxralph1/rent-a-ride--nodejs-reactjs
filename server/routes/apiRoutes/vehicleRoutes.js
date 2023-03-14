const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const vehicleController = require('../../controllers/vehicleController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.get('/:searchKey', vehicleController.searchVehicles)

router.use(authenticated)

router.route('/')
        .get(checkRoles(roles.admin), vehicleController.getAllVehicles)
        .post(vehicleController.createVehicle);

router.route('/:vehicle')
        .get(vehicleController.getVehicle)
        .patch(vehicleController.softDeleteVehicle);

router.route('/:id')
        .put(vehicleController.updateVehicle)
        .patch(checkRoles(roles.admin), vehicleController.updateVehicleAdminLevel)
        .delete(checkRoles(roles.admin), vehicleController.deleteVehicle);

router.patch('/:vehicle/reactivate', checkRoles(roles.admin), vehicleController.reactivateSoftDeletedVehicle)


module.exports = router;