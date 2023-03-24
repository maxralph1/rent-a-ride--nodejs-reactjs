const Joi = require('joi');


const getUserLocationSchema = Joi.object({
    user_location: Joi.string()
});


module.exports = getUserLocationSchema;