const Payment = require('../models/Payment');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const getPaymentSchema = require('../requestValidators/payments/getPaymentValidator');
const createPaymentSchema = require('../requestValidators/payments/createPaymentValidator');
const updatePaymentSchema = require('../requestValidators/payments/updatePaymentValidator');
const getUserSchema = require('../requestValidators/users/getUserValidator');


/**
 * @apiGroup Payments
 * @apiPermission auth, admin
 * @api {get} /api/v1/payments 00. Get All Payments
 * @apiName GetPayments
 * 
 * @apiDescription This retrieves all payments.
 *
 * @apiSuccess {String} _id Payment ID.
 * @apiSuccess {String} payment_initiated_on Payment initiation/start date/time.
 * @apiSuccess {String} payment_method Method of payment (enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum']).
 * @apiSuccess {String} status Method of payment (enum: ['Declined', 'Pending', 'Successful']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} vehicle_hire The vehicle hire record.
 * @apiSuccess {String} paid_by The user making the payment.
 * @apiSuccess {String} created_at Payment creation date/time.
 * @apiSuccess {String} updated_at Payment update date/time.
 * @apiSuccess {String} deleted_at Payment deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no payments found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Payments found"
 *     }
 */
const getAllPayments = async (req, res) => {
    const payments = await Payment.find().sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.status(200).json({ data: payments });
};

/**
 * @apiGroup Payments
 * @apiPermission auth, admin
 * @api {get} /api/v1/user-payments/users/:user 01. Get All User Payments
 * @apiName GetUserPayments
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This retrieves all payments.
 *
 * @apiSuccess {String} _id Payment ID.
 * @apiSuccess {String} payment_initiated_on Payment initiation/start date/time.
 * @apiSuccess {String} payment_method Method of payment (enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum']).
 * @apiSuccess {String} status Method of payment (enum: ['Declined', 'Pending', 'Successful']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} vehicle_hire The vehicle hire record.
 * @apiSuccess {String} paid_by The user making the payment.
 * @apiSuccess {String} created_at Payment creation date/time.
 * @apiSuccess {String} updated_at Payment update date/time.
 * @apiSuccess {String} deleted_at Payment deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no payments found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Payments found"
 *     }
 */
const getAllUserPayments = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ _id: validatedData.user }).lean();

    const payments = await Payment.find({$or: [{hiree: userFound._id}, {hirer: userFound._id}]}).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.json({ data: payments });
};

/**
 * @apiGroup Payments
 * @apiPermission auth
 * @api {get} /api/v1/my-payments 02. Get All Payments by the Currently Authenticated User
 * @apiName GetAuthUserPayments
 * 
 * @apiDescription This retrieves all payments by the currently authenticated user.
 *
 * @apiSuccess {String} _id Payment ID.
 * @apiSuccess {String} payment_initiated_on Payment initiation/start date/time.
 * @apiSuccess {String} payment_method Method of payment (enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum']).
 * @apiSuccess {String} status Method of payment (enum: ['Declined', 'Pending', 'Successful']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} vehicle_hire The vehicle hire record.
 * @apiSuccess {String} paid_by The user making the payment.
 * @apiSuccess {String} created_at Payment creation date/time.
 * @apiSuccess {String} updated_at Payment update date/time.
 * @apiSuccess {String} deleted_at Payment deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               },
 *               {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no payments found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Payments found"
 *     }
 */
const getAllAuthUserPayments = async (req, res) => {
    const userFound = await User.findOne({ _id: req.user_id }).lean();

    const payments = await Payment.find({$or: [{hiree: userFound._id}, {hirer: userFound._id}]}).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.json({ data: payments });
};

/**
 * @apiGroup Payments
 * @apiPermission auth, admin
 * @api {get} /api/v1/user-payments-made/users/:user 03. Get All Payments made by a User (Hiree)
 * @apiName GetAllUserPayments
 * 
 * @apiParam {String} user User's (hiree's) ID.
 * 
 * @apiDescription This retrieves all payments by a user.
 *
 * @apiSuccess {String} _id Payment ID.
 * @apiSuccess {String} payment_initiated_on Payment initiation/start date/time.
 * @apiSuccess {String} payment_method Method of payment (enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum']).
 * @apiSuccess {String} status Method of payment (enum: ['Declined', 'Pending', 'Successful']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} vehicle_hire The vehicle hire record.
 * @apiSuccess {String} paid_by The user making the payment.
 * @apiSuccess {String} created_at Payment creation date/time.
 * @apiSuccess {String} updated_at Payment update date/time.
 * @apiSuccess {String} deleted_at Payment deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               },
 *               {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no payments found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Payments found"
 *     }
 */
const getAllUserPaymentsMade = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ _id: validatedData.user }).lean();

    const payments = await Payment.find({ hiree: userFound._id }).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.json({ data: payments });
};

/**
 * @apiGroup Payments
 * @apiPermission auth
 * @api {get} /api/v1/my-payments/made 04. Get All Payments made by a User (Hiree)
 * @apiName GetAllAuthUserPaymentsMade
 * 
 * @apiDescription This retrieves all payments by a user.
 *
 * @apiSuccess {String} _id Payment ID.
 * @apiSuccess {String} payment_initiated_on Payment initiation/start date/time.
 * @apiSuccess {String} payment_method Method of payment (enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum']).
 * @apiSuccess {String} status Method of payment (enum: ['Declined', 'Pending', 'Successful']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} vehicle_hire The vehicle hire record.
 * @apiSuccess {String} paid_by The user making the payment.
 * @apiSuccess {String} created_at Payment creation date/time.
 * @apiSuccess {String} updated_at Payment update date/time.
 * @apiSuccess {String} deleted_at Payment deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               },
 *               {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no payments found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Payments found"
 *     }
 */
const getAllAuthUserPaymentsMade = async (req, res) => {

    const userFound = await User.findOne({ _id: req.user_id }).lean();

    const payments = await Payment.find({ hiree: userFound._id }).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.json({ data: payments });
};

/**
 * @apiGroup Payments
 * @apiPermission auth
 * @api {get} /api/v1/user-payments-received/users/:user 05. Get All Payments Received by a User (Hirer)
 * @apiName GetAllUserPaymentsReceived
 * 
 * @apiParam {String} user User's (hirer's) ID.
 * 
 * @apiDescription This retrieves all payments by a user.
 *
 * @apiSuccess {String} _id Payment ID.
 * @apiSuccess {String} payment_initiated_on Payment initiation/start date/time.
 * @apiSuccess {String} payment_method Method of payment (enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum']).
 * @apiSuccess {String} status Method of payment (enum: ['Declined', 'Pending', 'Successful']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} vehicle_hire The vehicle hire record.
 * @apiSuccess {String} paid_by The user making the payment.
 * @apiSuccess {String} created_at Payment creation date/time.
 * @apiSuccess {String} updated_at Payment update date/time.
 * @apiSuccess {String} deleted_at Payment deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               },
 *               {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no payments found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Payments found"
 *     }
 */
const getAllUserPaymentsReceived = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ _id: validatedData.user }).lean();

    const payments = await Payment.find({ hirer: userFound._id }).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.status(200).json({ data: payments });
};

/**
 * @apiGroup Payments
 * @apiPermission auth
 * @api {get} /api/v1/my-payments/received 06. Get All Payments Received by currently Authenticated User/Vehicle Owner (Hirer)
 * @apiName GetAllAuthUserPaymentsReceived
 * 
 * @apiDescription This retrieves all payments by a user.
 *
 * @apiSuccess {String} _id Payment ID.
 * @apiSuccess {String} payment_initiated_on Payment initiation/start date/time.
 * @apiSuccess {String} payment_method Method of payment (enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum']).
 * @apiSuccess {String} status Method of payment (enum: ['Declined', 'Pending', 'Successful']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} vehicle_hire The vehicle hire record.
 * @apiSuccess {String} paid_by The user making the payment.
 * @apiSuccess {String} created_at Payment creation date/time.
 * @apiSuccess {String} updated_at Payment update date/time.
 * @apiSuccess {String} deleted_at Payment deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               },
 *               {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no payments found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Payments found"
 *     }
 */
const getAllAuthUserPaymentsReceived = async (req, res) => {
    const userFound = await User.findOne({ _id: req.user_id }).lean();

    const payments = await Payment.find({ hirer: userFound._id }).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.json({ data: payments });
};

/**
 * @apiGroup Payments
 * @apiPermission auth
 * @api {get} /api/v1/payments/:payment 07. Get Payment
 * @apiName GetPayment
 * 
 * @apiParam {String} payment Payment ID.
 * 
 * @apiDescription This retrieves all payments by a user.
 *
 * @apiSuccess {String} _id Payment ID.
 * @apiSuccess {String} payment_initiated_on Payment initiation/start date/time.
 * @apiSuccess {String} payment_method Method of payment (enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum']).
 * @apiSuccess {String} status Method of payment (enum: ['Declined', 'Pending', 'Successful']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} vehicle_hire The vehicle hire record.
 * @apiSuccess {String} paid_by The user making the payment.
 * @apiSuccess {String} created_at Payment creation date/time.
 * @apiSuccess {String} updated_at Payment update date/time.
 * @apiSuccess {String} deleted_at Payment deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }
 *     }
 * 
 * @apiError NotFound Possible error message if no payment found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Payments matches 641998f45d6408b13cb229b0"
 *     }
 */
const getPayment = async (req, res) => {
    if (!req?.params?.payment) return res.status(400).json({ message: "Payment required" });

    let validatedData;
    try {
        validatedData = await getPaymentSchema.validateAsync({ payment: req.params.payment })
    } catch (error) {
        return res.status(400).json({ message: "Payment key validation failed", details: `${error}` });
    }

    const paymentFound = await Payment.findOne({ _id: validatedData.payment }).lean();
    if (!paymentFound) {
        return res.status(404).json({ message: `No payment matches ${validatedData.payment}` });
    }

    res.json({ data: paymentFound });
}

/**
 * @apiGroup Payments
 * @apiPermission auth
 * @api {post} /api/v1/payments 08. Create New Payment
 * @apiName CreateNewPayment
 * 
 * @apiDescription This creates a new payment.
 * 
 * @apiBody {String} payment_method     Method of payment.
 * @apiBody {String} hiree       The user who rents the vehicle from the owner.
 * @apiBody {String} hirer       The owner of the vehicle.
 * @apiBody {String} vehicle       The vehicle.
 * @apiBody {String} vehicle_hire       The vehicle hire record.
 * @apiExample {json} Request Body:
 *     {
 *        "payment_method": "Debit/Credit Card",
 *        "hiree": "641998f45d6408b13cb229b0",
 *        "hirer": "641998f45d6408b13cb229b0",
 *        "vehicle": "641998f45d6408b13cb229b0",
 *        "vehicle_hire": "641998f45d6408b13cb229b0",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 PaymentCreated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *                },
 *       "success": "Payment 641998f45d6408b13cb229b0 created"
 *     }
 * 
 * @apiError CreatePaymentErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 */
const createPayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createPaymentSchema.validateAsync({ payment_method: req.body.payment_method,  
                                                                hiree: req.body.hiree, 
                                                                hirer: req.body.hirer, 
                                                                vehicle: req.body.vehicle, 
                                                                vehicle_hire: req.body.vehicle_hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const payment = new Payment({
        payment_initiated: new Date().toISOString(),
        payment_method: validatedData.payment_method,
        status: validatedData.status,
        hiree: validatedData.hiree,
        hirer: validatedData.hirer,
        vehicle: validatedData.vehicle,
        vehicle_hire: validatedData.vehicle_hire,
        paid_by: req.user_id
    });

    payment.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `Payment ${payment._id} added`, data: payment });
    });
}

/**
 * @apiGroup Payments
 * @apiPermission auth, admin
 * @api {put} /api/v1/payments/:payment 09. Update Existing Payment
 * @apiName UpdatePayment
 * 
 * @apiParam {String} payment Payment's ID.
 * 
 * @apiDescription This updates an existing payment.
 * 
 * @apiBody {String} [payment_method]     Method of payment.
 * @apiBody {String} [hiree]       The user who rents the vehicle from the owner.
 * @apiBody {String} [hirer]       The owner of the vehicle.
 * @apiBody {String} [vehicle]       The vehicle.
 * @apiBody {String} [vehicle_hire]       The vehicle hire record.
 * @apiExample {json} Request Body:
 *     {
 *        "payment_method": "Debit/Credit Card",
 *        "hiree": "641998f45d6408b13cb229b0",
 *        "hirer": "641998f45d6408b13cb229b0",
 *        "vehicle": "641998f45d6408b13cb229b0",
 *        "vehicle_hire": "641998f45d6408b13cb229b0",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 PaymentCreated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "payment_initiated_on": "2023-07-01T10:59:17.117+00:00",
 *                  "payment_method": "Debit/Credit Card",
 *                  "status": "Successful",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "paid_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *                },
 *       "success": "Payment 641998f45d6408b13cb229b0 updated"
 *     }
 * 
 * @apiError CreateUserErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 */
const updatePayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updatePaymentSchema.validateAsync({ payment: req.params.payment, 
                                                                payment_method: req.body.payment_method, 
                                                                status: req.body.status,  
                                                                hiree: req.body.hiree, 
                                                                hirer: req.body.hirer, 
                                                                vehicle: req.body.vehicle, 
                                                                vehicle_hire: req.body.vehicle_hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const paymentFound = await Payment.findOne({ _id: validatedData.payment }).exec();
    if (!paymentFound) return res.status(404).json({ message: "Payment not found" });

    if (validatedData.payment_method) paymentFound.payment_method = validatedData.payment_method;
    if (validatedData.status) paymentFound.status = validatedData.status;
    if (validatedData.hiree) paymentFound.hiree = validatedData.hiree;
    if (validatedData.hirer) paymentFound.hirer = validatedData.hirer;
    if (validatedData.vehicle) paymentFound.vehicle = validatedData.vehicle;
    if (validatedData.vehicle_hire) paymentFound.vehicle_hire = validatedData.vehicle_hire;

    paymentFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ data: `${paymentFound}`, success: `Payment ${paymentFound._id} updated` });
    });
}

/**
 * @apiGroup Payments
 * @apiPermission auth
 * @api {patch} /api/v1/payments/:payment 10. Soft-Delete Payment
 * @apiName SoftDeletePayment
 * 
 * @apiParam {String} payment Payment's ID.
 * 
 * @apiDescription This soft-deletes payment (user uses this to delete payment. They can never retrieve it again. But same deleted payment record can be retrieved by admin.).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 PaymentInactivated
 *     {
 *       "data": {
 *                  "payment_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "Payment 641998f45d6408b13cb229b0 inactivated / deleted"
 *     }
 * 
 * @apiError PaymentSoftDeleteErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 403 Unauthorized
 *     {
 *       "message": "You do not have permission to delete payment records that do not belong to you"
 *     }
 * 
 *     HTTP/1.1 404 PaymentNotFound
 *     {
 *       "message": "Payment not found"
 *     }
 */
const softDeletePayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getPaymentSchema.validateAsync({ payment: req.params.payment });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const paymentFound = await Payment.findOne({ _id: validatedData.payment }).exec();
    if (!paymentFound) return res.status(404).json({ message: "Payment not found" });

    if (paymentFound.hiree != req.user_id) {
        return res.status(403).json({ message: "You do not have permission to delete payment records that do not belong to you" });

    } else if (paymentFound.hiree == req.user_id) {
        if (paymentFound.deleted_at == '') {
            paymentFound.deleted_at = new Date().toISOString();
        }

        paymentFound.save((error) => {
            if (error) {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }
            res.status(200).json({ data: {"payment_id": `${paymentFound._id}`}, success: `Payment ${paymentFound._id} inactivated / deleted` });
        });
    };
}

/**
 * @apiGroup Payments
 * @apiPermission auth, admin
 * @api {patch} /api/v1/payments/:payment/re-activate 11. Re-activate Soft-Deleted Payment
 * @apiName ReactivateSoftDeletedPayment
 * 
 * @apiParam {String} payment Payment's ID.
 * 
 * @apiDescription This allows soft-deleted payment record to be re-activated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 PaymentReactivated
 *     {
 *       "data": {
 *                  "payment_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "Payment 641998f45d6408b13cb229b0 reactivated"
 *     }
 * 
 * @apiError PaymentSoftDeleteErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed"
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 404 PaymentNotFound
 *     {
 *       "message": "Payment not found"
 *     }
 */
const reactivateSoftDeletePayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getPaymentSchema.validateAsync({ payment: req.params.payment });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const paymentFound = await Payment.findOne({ _id: validatedData.payment }).exec();
    if (!paymentFound) return res.status(404).json({ message: "Payment not found" });

    if (paymentFound.deleted_at != '') {
        paymentFound.deleted_at = '';
    }

    paymentFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ data: {"payment_id": `${paymentFound._id}`}, success: `Payment ${paymentFound._id} reactivated` });
    });
}

/**
 * @apiGroup Payments
 * @apiPermission auth, admin
 * @api {delete} /api/v1/payments/:payment 12. Delete Payment (Permanently)
 * @apiName DeletePayment
 * 
 * @apiParam {String} payment Payment's ID.
 * 
 * @apiDescription This allows for permanent deletion of payment record by admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 Deleted
 *     {
 *       "data": {
 *                  "payment_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "Payment 641998f45d6408b13cb229b0 has been permanently deleted"
 *     }
 * 
 * @apiError PaymentDeleteErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Parameter validation failed",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 404 PaymentNotFound
 *     {
 *       "message": "No payment matches the payment 641998f45d6408b13cb229b0"
 *     }
 */
const deletePayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getPaymentSchema.validateAsync({ payment: req.params.payment })
    } catch (error) {
        return res.status(400).json({ message: "Parameter validation failed", details: `${error}` });
    }

    const payment = await Payment.findOne({ _id: validatedData.payment }).exec();
    if (!payment) {
        return res.status(404).json({ message: `No payment matches the payment ${validatedData.payment}` });
    }

    const deletedPayment = await payment.deleteOne();

    res.status(200).json({ data: {"payment_id": `${deletedPayment._id}`},  success: `Payment ${deletedPayment._id} has been permanently deleted` })
}


module.exports = {
    getAllPayments,
    getAllUserPayments, 
    getAllAuthUserPayments, 
    getAllUserPaymentsMade, 
    getAllAuthUserPaymentsMade, 
    getAllUserPaymentsReceived, 
    getAllAuthUserPaymentsReceived, 
    getPayment,
    createPayment,
    updatePayment,
    softDeletePayment, 
    reactivateSoftDeletePayment, 
    deletePayment
}