const Joi = require('joi');


const createPaymentSchema = Joi.object({
    payment_method: Joi.string().min(1).max(30).required(),
    user_hiring: Joi.string().required(),
    user_renting: Joi.string().required(),
    vehicle: Joi.string().required(),
    vehicle_hire: Joi.string().required(),
});


module.exports = createPaymentSchema;