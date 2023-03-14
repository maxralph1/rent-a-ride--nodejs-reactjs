const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const paymentController = require('../../controllers/paymentController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated)


router.use(authenticated)

router.route('/')
        .get(checkRoles(roles.admin), paymentController.getAllPayments)
        .post(paymentController.createPayment);

router.get('/:payment', paymentController.getPayment);

router.route('/:payment')
        .patch(paymentController.softDeletePayment)
        .put(checkRoles(roles.admin), paymentController.updatePayment)
        .delete(checkRoles(roles.admin), paymentController.deletePayment);


module.exports = router;