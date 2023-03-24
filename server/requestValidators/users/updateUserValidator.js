const Joi = require('joi');


const updateUserSchema = Joi.object({
    // param
    user: Joi.string(),
    // body
    username: Joi.string().alphanum().min(3).max(30),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: Joi.ref('password'),
    first_name: Joi.string().max(30),
    other_names: Joi.string().max(30),
    last_name: Joi.string().max(30),
    enterprise_name: Joi.string().max(100),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }),
    phone: Joi.string().max(20),
    id_type: Joi.string().min(1).max(40),
    id_number: Joi.string().min(1).max(50),
    date_of_birth: Joi.string().max(30),
    address: Joi.string().max(100),
    // user_image_path: Joi.string().dataUri(),
    // user_identification_image_path: Joi.string().dataUri(),
    account_type: Joi.string().max(30),
    email_verified: Joi.string().max(30),
    active: Joi.string(),
    verified: Joi.string(),
    created_by: Joi.string(),
    deleted_at: Joi.string().max(30)
});


module.exports = updateUserSchema;