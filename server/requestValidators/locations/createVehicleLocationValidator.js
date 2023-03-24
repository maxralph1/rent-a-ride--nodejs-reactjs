const Joi = require('joi');


const createVehicleLocationSchema = Joi.object({
    // params
    vehicle: Joi.string(),

    // body
    address: Joi.string().max(100),
    latitude: Joi.string().max(30),
    longitude: Joi.string().max(30),
    plus_code: Joi.string(),
});


module.exports = createVehicleLocationSchema;