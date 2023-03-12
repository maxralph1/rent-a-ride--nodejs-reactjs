const Joi = require('joi');


const mailPasswordResetLinkSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }),
    // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});


module.exports = mailPasswordResetLinkSchema;