const Joi = require('joi');


const updateVehicleHireSchema = Joi.object({
    release_date: Joi.string().max(30),
    release_time: Joi.string().max(30),
    due_back_date: Joi.string().max(30),
    due_back_time: Joi.string().max(30),
    return_date: Joi.string().max(30),
    return_time: Joi.string().max(30),
    user_hiring: Joi.string(),
    user_renting: Joi.string(),
    vehicle: Joi.string(),
});


module.exports = updateVehicleHireSchema;