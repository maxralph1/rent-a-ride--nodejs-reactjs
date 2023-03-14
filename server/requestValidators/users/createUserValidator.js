const Joi = require('joi');


const createUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: Joi.ref('password'),
    first_name: Joi.string().min(1).max(30).required(),
    other_names: Joi.string().min(1).max(30),
    last_name: Joi.string().min(1).max(30).required(),
    enterprise_name: Joi.string().min(1).max(100).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }),
    phone: Joi.string().min(1).max(20).required(),
    id_type: Joi.string().min(1).max(20).required(),
    id_number: Joi.string().min(1).max(50).required(),
    address: Joi.string().max(100),
    date_of_birth: Joi.string().max(30),
    user_image_path: Joi.string().dataUri(),
    user_identification_image_path: Joi.string().dataUri(),
    type: Joi.string().max(30)
});


module.exports = createUserSchema;