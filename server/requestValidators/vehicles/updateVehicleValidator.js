const Joi = require('joi');


const updateVehicleSchema = Joi.object({
    vehicle_brand: Joi.string().max(30).required(),
    vehicle_model: Joi.string().max(30).required(),
    vehicle_engine_number: Joi.string().max(30).required(),
    vehicle_identification_number: Joi.string().max(30).required(),
    vehicle_plate_number: Joi.string().max(30).required(),
    picture_path: Joi.string().max(30).required(),
    status: Joi.string(),
    verified: Joi.string().max(30),
    active: Joi.boolean(),
    company_owned: Joi.boolean()
});


module.exports = updateVehicleSchema;