const Joi = require('joi');


const getPaymentSchema = Joi.object({
    payment: Joi.string()
});


module.exports = getPaymentSchema;