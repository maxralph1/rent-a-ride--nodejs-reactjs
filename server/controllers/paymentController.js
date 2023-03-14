const Payment = require('../models/Payment');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const createPaymentSchema = require('../requestValidators/payments/createPaymentValidator');
const updatePaymentSchema = require('../requestValidators/payments/updatePaymentValidator');


const getAllPayments = async (req, res) => {
    const payments = await Payment.find().sort('-created_at').lean();
    if (!payments?.length) return res.status(404).json({ message: "No payments found" });

    res.status(200).json(posts);
};

const getPayment = async (req, res) => {
    if (!req?.params?.payment) return res.status(400).json({ message: "Payment required" });

    let validatedData;
    try {
        validatedData = await getPaymentSchema.validateAsync({ id: req.params.id })
    } catch (error) {
        return res.status(400).json({ message: "Payment key validation failed", details: `${error}` });
    }

    const paymentFound = await Payment.findOne({ _id: validatedData.payment }).lean();
    if (!paymentFound) {
        return res.status(404).json({ message: `No payment matches ${validatedData.payment}` });
    }

    res.json(paymentFound);
}

const createPayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createPaymentSchema.validateAsync({ payment_method: req.body.payment_method, 
                                                                status: req.body.status,  
                                                                user_hiring: req.body.user_hiring, 
                                                                user_renting: req.body.user_renting, 
                                                                vehicle: req.body.vehicle, 
                                                                vehicle_hire: req.body.vehicle_hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const payment = new Payment({
        payment_initiated: new Date().toISOString(),
        payment_method: validatedData.payment_method,
        status: validatedData.status,
        user_hiring: validatedData.user_hiring,
        user_renting: validatedData.user_renting,
        vehicle: validatedData.vehicle,
        vehicle_hire: validatedData.vehicle_hire
    });

    payment.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ message: `Payment ${payment._id} added` });
    });
}

const updatePayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updatePaymentSchema.validateAsync({ id: req.body.id, 
                                                                payment_method: req.body.payment_method, 
                                                                status: req.body.status,  
                                                                user_hiring: req.body.user_hiring, 
                                                                user_renting: req.body.user_renting, 
                                                                vehicle: req.body.vehicle, 
                                                                vehicle_hire: req.body.vehicle_hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const paymentFound = await Payment.findOne({ _id: validatedData.id }).exec();
    if (!paymentFound) return res.status(404).json({ message: "Payment not found" });

    if (validatedData.payment_method) paymentFound.payment_method = validatedData.payment_method;
    if (validatedData.status) paymentFound.status = validatedData.status;
    if (validatedData.user_hiring) paymentFound.user_hiring = validatedData.user_hiring;
    if (validatedData.user_renting) paymentFound.user_renting = validatedData.user_renting;
    if (validatedData.vehicle) paymentFound.vehicle = validatedData.vehicle;
    if (validatedData.vehicle_hire) paymentFound.vehicle_hire = validatedData.vehicle_hire;

    paymentFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Payment ${paymentFound._id} updated` });
    });
}

const softDeletePayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await softDeletePaymentSchema.validateAsync({ _id: req.body.id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const paymentFound = await Payment.findOne({ _id: validatedData.id }).exec();
    if (!paymentFound) return res.status(404).json({ message: "Payment not found" });

    if (paymentFound.active == true) {
        paymentFound.active = false;
        paymentFound.soft_deleted = new Date().toISOString();
    }

    paymentFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Payment ${paymentFound._id} inactivated / deleted` });
    });
}

const deletePayment = async (req, res) => {

    let validatedData;
    try {
        validatedData = await deletePaymentSchema.validateAsync({ _id: req.params.id })
    } catch (error) {
        return res.status(400).json({ message: "Payment search term validation failed", details: `${error}` });
    }

    const payment = await Payment.findOne({ _id: validatedData.id }).exec();
    if (!payment) {
        return res.status(404).json({ message: `No payment matches the payment ${validatedData.id}` });
    }

    const deletedPayment = await payment.deleteOne();

    res.status(200).json({message: `Payment ${deletedPayment} has been permanently deleted` })
}


module.exports = {
    getAllPayments,
    getPayment,
    createPayment,
    updatePayment,
    softDeletePayment,
    deletePayment
}