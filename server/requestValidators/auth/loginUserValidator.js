const Joi = require('joi');


const loginUserSchema = Joi.object({
    username_email: Joi.string().min(3).max(50).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});


module.exports = loginUserSchema;