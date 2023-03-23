const Joi = require('joi');


const getVehicleSchema = Joi.object({
    vehicle: Joi.string()
});


module.exports = getVehicleSchema;