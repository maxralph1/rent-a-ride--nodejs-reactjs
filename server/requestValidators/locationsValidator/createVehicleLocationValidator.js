const Joi = require('joi');


const createVehicleLocationSchema = Joi.object({
    address: Joi.string().min(1).max(100),
    latitude: Joi.string().min(1).max(30),
    longitude: Joi.string().min(1).max(30),
    plus_code: Joi.string(),
    vehicle: Joi.string(),
});


module.exports = createVehicleLocationSchema;