const Joi = require('joi');


const createPaymentSchema = Joi.object({
    payment_method: Joi.string().min(1).max(30).required(),
    hiree: Joi.string().required(),
    hirer: Joi.string().required(),
    vehicle: Joi.string().required(),
    vehicle_hire: Joi.string().required()
});


module.exports = createPaymentSchema;