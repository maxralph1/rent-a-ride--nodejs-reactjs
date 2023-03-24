const Joi = require('joi');


const createInteractionSchema = Joi.object({
    // params
    vehicle: Joi.string(),
    user: Joi.string(),
    hire: Joi.string(),

    // body
    message: Joi.string().max(100)
});


module.exports = createInteractionSchema;