const Joi = require('joi');


const registerUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    first_name: Joi.string(),
    other_names: Joi.string(),
    last_name: Joi.string(),
    user_image_path: Joi.string(),
    enterprise_name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }).required(),
    // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string(),
    id_type: Joi.string(),
    id_number: Joi.string(),
    user_identification_image_path: Joi.string(),
    address: Joi.string(),
    date_of_birth: Joi.string(),
    account_type: Joi.string().max(30),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: Joi.ref('password')
});


module.exports = registerUserSchema;