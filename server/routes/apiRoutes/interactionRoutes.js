const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles');
const interactionController = require('../../controllers/interactionController');


router.use(authenticated);

router.get('/vehicles/:vehicle', checkRoles(roles.admin), interactionController.getInteractionByVehicle);

router.get('/vehicles/:vehicle/auth', interactionController.getInteractionByVehicleAuth);

router.get('/vehicle-hires/:hire', checkRoles(roles.admin), interactionController.getInteractionByVehicleHire);

router.get('/vehicle-hires/:hire/auth', checkRoles(roles.admin), interactionController.getInteractionByVehicleHireAuth);

router.post('/vehicles/:vehicle', interactionController.createInteractionForVehicle);

router.post('/vehicle-hires/:hire', interactionController.createInteractionForVehicleHire);

router.route('/:interaction')
        .put(interactionController.updateInteraction)
        .delete(checkRoles(roles.admin), interactionController.deleteInteraction);

router.put('/:interaction/delete', checkRoles(roles.admin), interactionController.softDeleteInteraction);

router.put('/:interaction/re-activate', checkRoles(roles.admin), interactionController.reactivateSoftDeletedInteraction);

