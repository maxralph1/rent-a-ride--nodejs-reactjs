const Joi = require('joi');


const getVehicleLocationSchema = Joi.object({
    vehicle_location: Joi.string()
});


module.exports = getVehicleLocationSchema;