const Joi = require('joi');


const updateVehicleHireSchema = Joi.object({
    release_date: Joi.string().max(30),
    release_time: Joi.string().max(30),
    due_back_date: Joi.string().max(30),
    due_back_time: Joi.string().max(30),
    return_date: Joi.string().max(30),
    return_time: Joi.string().max(30),
    paid: Joi.string().max(30),
    vehicle_hire_charge_timing: Joi.string(),
    hiree: Joi.string(),
    hirer: Joi.string(),
    vehicle: Joi.string(),
    booked_by: Joi.string(),
    booking_updated_by: Joi.string(),
    deleted_at: Joi.string()
});


module.exports = updateVehicleHireSchema;