const Joi = require('joi');


const getContactUsSchema = Joi.object({
    contactUs: Joi.string()
});


module.exports = getContactUsSchema;