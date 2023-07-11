const Joi = require('joi');


const createVehicleSchema = Joi.object({
    vehicle_type: Joi.string().max(30).required(),
    vehicle_type_if_others: Joi.string(),
    vehicle_brand: Joi.string().max(30).required(),
    vehicle_model: Joi.string().max(30).required(),
    vehicle_engine_number: Joi.string().max(30).required(),
    vehicle_identification_number: Joi.string().max(30).required(),
    vehicle_plate_number: Joi.string().max(30).required(),
    vehicle_hire_rate_in_figures: Joi.number().max(35),
    vehicle_hire_rate_currency: Joi.string().max(20),
    vehicle_hire_charge_per_timing: Joi.string().max(10),
    maximum_allowable_distance: Joi.string().max(20),
    status: Joi.string().max(15),
    verified: Joi.string().max(20),
    active: Joi.string().max(20),
    company_owned: Joi.string().max(20)
});


module.exports = createVehicleSchema;