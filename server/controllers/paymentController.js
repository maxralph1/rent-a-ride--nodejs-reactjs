const Payment = require('../models/Payment');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const getPaymentSchema = require('../requestValidators/payments/getPaymentValidator');
const createPaymentSchema = require('../requestValidators/payments/createPaymentValidator');
const updatePaymentSchema = require('../requestValidators/payments/updatePaymentValidator');
const getUserSchema = require('../requestValidators/users/getUserValidator');


const getAllPayments = async (req, res) => {
    const payments = await Payment.find().sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.status(200).json(posts);
};

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

const getAllAuthUserPayments = async (req, res) => {
    const userFound = await User.findOne({ _id: req.user_id }).lean();

    const payments = await Payment.find({$or: [{hiree: userFound._id}, {hirer: userFound._id}]}).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.json({ data: payments });
};

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

const getAllAuthUserPaymentsMade = async (req, res) => {

    const userFound = await User.findOne({ _id: req.user_id }).lean();

    const payments = await Payment.find({ hiree: userFound._id }).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.json({ data: payments });
};

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

const getAllAuthUserPaymentsReceived = async (req, res) => {
    const userFound = await User.findOne({ _id: req.user_id }).lean();

    const payments = await Payment.find({ hirer: userFound._id }).sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.json({ data: payments });
};

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
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Payment ${paymentFound._id} updated` });
    });
}

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
                return res.status(400).json(error);
            }
            res.status(200).json({ success: `Payment ${paymentFound._id} inactivated / deleted` });
        });
    };
}

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
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Payment ${paymentFound._id} reactivated` });
    });
}

const deletePayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getPaymentSchema.validateAsync({ payment: req.params.payment })
    } catch (error) {
        return res.status(400).json({ message: "Payment search term validation failed", details: `${error}` });
    }

    const payment = await Payment.findOne({ _id: validatedData.payment }).exec();
    if (!payment) {
        return res.status(404).json({ message: `No payment matches the payment ${validatedData.payment}` });
    }

    const deletedPayment = await payment.deleteOne();

    res.status(200).json({ success: `Payment ${deletedPayment} has been permanently deleted` })
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