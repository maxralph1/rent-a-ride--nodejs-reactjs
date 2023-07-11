const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const vehicleHireController = require('../../controllers/vehicleHireController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated)

router.route('/')
        .get(checkRoles(roles.admin), vehicleHireController.getAllVehicleHires)
        .post(vehicleHireController.createVehicleHire);

router.route('/:vehicle-hire')
        .get(vehicleHireController.getVehicleHire)
        .put(vehicleHireController.stopVehicleHire)
        .patch(vehicleHireController.softDeleteVehicleHire);

router.route('/:id')
        // .put(vehicleHireController.updateVehicleHire)
        .patch(checkRoles(roles.admin), vehicleHireController.updateVehicleHireAdminLevel)
        .delete(checkRoles(roles.admin), vehicleHireController.deleteVehicleHire);

router.patch('/:vehicle-hire/reactivate', checkRoles(roles.admin), vehicleHireController.reactivateSoftDeletedVehicleHire)


module.exports = router;