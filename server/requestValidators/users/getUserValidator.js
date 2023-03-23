const Joi = require('joi');


const getUserSchema = Joi.object({
    user: Joi.string()
});


module.exports = getUserSchema;