const Joi = require('joi');


const createVehicleHireSchema = Joi.object({
    release_date: Joi.string().max(30).required(),
    release_time: Joi.string().max(30).required(),
    due_back_date: Joi.string().max(30).required(),
    due_back_time: Joi.string().max(30).required(),
    // return_date: Joi.string().max(30).required(),
    // return_time: Joi.string().max(30).required(),
    vehicle_hire_charge_timing: Joi.string(),
    hiree: Joi.string().required(),
    hirer: Joi.string().required(),
    vehicle: Joi.string().required()
});


module.exports = createVehicleHireSchema;