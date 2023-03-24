const Joi = require('joi');


const searchSchema = Joi.object({
    search: Joi.string()
});


module.exports = searchSchema;