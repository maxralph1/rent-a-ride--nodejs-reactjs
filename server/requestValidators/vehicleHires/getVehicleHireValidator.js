const Joi = require('joi');


const getVehicleHireSchema = Joi.object({
    vehicle_hire: Joi.string()
});


module.exports = getVehicleHireSchema;