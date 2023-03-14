const Joi = require('joi');


const updatePaymentSchema = Joi.object({
    payment_method: Joi.string().min(1).max(30),
    status: Joi.string().min(1).max(13),
    user_hiring: Joi.string(),
    user_renting: Joi.string(),
    vehicle: Joi.string(),
    vehicle_hire: Joi.string(),
});


module.exports = updatePaymentSchema;