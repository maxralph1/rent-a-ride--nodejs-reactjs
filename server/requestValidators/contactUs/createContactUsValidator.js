const Joi = require('joi');


const createContactUsSchema = Joi.object({
    // params
    message: Joi.string(),

    // body
    title: Joi.string().max(30),
    body: Joi.string().max(30),
    name: Joi.string(),
    email: Joi.string()
});


module.exports = createContactUsSchema;