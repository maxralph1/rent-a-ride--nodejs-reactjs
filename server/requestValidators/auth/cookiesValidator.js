const Joi = require('joi');


const cookiesSchema = Joi.object({
    cookies: Joi.string()
});


module.exports = cookiesSchema;