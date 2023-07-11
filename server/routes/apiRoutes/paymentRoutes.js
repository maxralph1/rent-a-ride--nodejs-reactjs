const express = require('express');
const router = express.Router();
const authenticated = require('../../middleware/authenticated');
const paymentController = require('../../controllers/paymentController');
const roles = require('../../config/allowedRoles');
const checkRoles = require('../../middleware/checkRoles')


router.use(authenticated);

router.route('/')
        .get(checkRoles(roles.admin), paymentController.getAllPayments)
        .post(paymentController.createPayment);

router.get('/user-payments/users/:user', checkRoles(roles.admin), paymentController.getAllUserPayments)
router.get('/user-payments-made/users/:user', checkRoles(roles.admin), paymentController.getAllUserPaymentsMade)
router.get('/user-payments-received/users/:user', checkRoles(roles.admin), paymentController.getAllUserPaymentsReceived)

router.get('/my-payments', paymentController.getAllAuthUserPayments);
router.get('/my-payments/made', paymentController.getAllAuthUserPaymentsMade);
router.get('/my-payments/received', paymentController.getAllAuthUserPaymentsReceived);

router.patch('/:payment/re-activate', checkRoles(roles.admin), paymentController.reactivateSoftDeletePayment);

router.route('/:payment')
        .get(paymentController.getPayment)
        .patch(paymentController.softDeletePayment)
        .put(checkRoles(roles.admin), paymentController.updatePayment)
        .delete(checkRoles(roles.admin), paymentController.deletePayment);


module.exports = router;