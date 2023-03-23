const Joi = require('joi');


const verifyMailLinkAuthenticateSchema = Joi.object({
    username: Joi.string(),
    token: Joi.string()
});


module.exports = verifyMailLinkAuthenticateSchema;