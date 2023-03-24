const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles');
const contactUsController = require('../../controllers/contactUsController');


router.route('/')
        .get(checkRoles(roles.admin), contactUsController.getAllContactUsMessages)
        .post(contactUsController.createContactUsMessage);

router.delete('/:message', authenticated, checkRoles(roles.admin), contactUsController.deleteContactUsMessage);


module.exports = router;