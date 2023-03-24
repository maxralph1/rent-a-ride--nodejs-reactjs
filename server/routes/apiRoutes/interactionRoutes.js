const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles');
const interactionController = require('../../controllers/interactionController');


router.use(authenticated);

router.get('/:interaction/vehicles/:vehicle/users/:user', checkRoles(roles.admin), interactionController.getInteractionByVehicle);

router.get('/:interaction/vehicles/:vehicle', interactionController.getInteractionByVehicleAuth);

router.get('/:interaction/vehicle-hires/:hire/users/:user', checkRoles(roles.admin), interactionController.getInteractionByVehicleHire);

router.get('/:interaction/vehicle-hires/:hire', checkRoles(roles.admin), interactionController.getInteractionByVehicleHireAuth);

router.post('/:interaction/vehicles/:vehicle', interactionController.createInteractionForVehicle);

router.post('/:interaction/vehicle-hires/:hire', interactionController.createInteractionForVehicleHire);

router.route('/:interaction')
        .put(interactionController.updateInteraction)
        .delete(checkRoles(roles.admin), interactionController.deleteInteraction);

router.put('/:interaction/delete', checkRoles(roles.admin), interactionController.softDeleteInteraction);

router.put('/:interaction/re-activate', checkRoles(roles.admin), interactionController.reactivateSoftDeletedInteraction);

