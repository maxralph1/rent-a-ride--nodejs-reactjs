const Joi = require('joi');


const verifyMailedPasswordResetLinkSchema = Joi.object({
    username: Joi.string(),
    token: Joi.string(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});


module.exports = verifyMailedPasswordResetLinkSchema;