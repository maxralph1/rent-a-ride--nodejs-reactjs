const Joi = require('joi');


const updateVehicleSchema = Joi.object({
    vehicle_type: Joi.string(),
    vehicle_type_if_others: Joi.string(),
    vehicle_brand: Joi.string(),
    vehicle_model: Joi.string(),
    vehicle_engine_number: Joi.string(),
    vehicle_identification_number: Joi.string(),
    vehicle_plate_number: Joi.string(),
    vehicle_hire_rate_in_figures: Joi.number(),
    vehicle_hire_rate_currency: Joi.string(),
    vehicle_hire_charge_per_timing: Joi.string(),
    maximum_allowable_distance: Joi.string(),
    status: Joi.string(),
    verified: Joi.string(),
    active: Joi.string(),
    company_owned: Joi.string(),
    deleted_at: Joi.string()
});


module.exports = updateVehicleSchema;