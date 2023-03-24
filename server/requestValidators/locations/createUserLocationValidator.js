const Joi = require('joi');


const createUserLocationSchema = Joi.object({
    // params
    user: Joi.string(),

    // body
    address: Joi.string().max(100),
    latitude: Joi.string().max(30),
    longitude: Joi.string().max(30),
    plus_code: Joi.string(),
});


module.exports = createUserLocationSchema;