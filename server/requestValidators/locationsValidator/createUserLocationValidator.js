const Joi = require('joi');


const createUserLocationSchema = Joi.object({
    address: Joi.string().min(1).max(100),
    latitude: Joi.string().min(1).max(30),
    longitude: Joi.string().min(1).max(30),
    plus_code: Joi.string(),
    user: Joi.string(),
});


module.exports = createUserLocationSchema;