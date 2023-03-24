const Joi = require('joi');


const updatePaymentSchema = Joi.object({
    payment_method: Joi.string().min(1).max(30).required(),
    status: Joi.string().min(1).max(13),
    hiree: Joi.string().required(),
    hirer: Joi.string().required(),
    vehicle: Joi.string().required(),
    vehicle_hire: Joi.string().required(),
    deleted_at: Joi.string()
});


module.exports = updatePaymentSchema;