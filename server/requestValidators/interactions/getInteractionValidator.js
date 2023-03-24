const Joi = require('joi');


const getInteractionSchema = Joi.object({
    interaction: Joi.string()
});


module.exports = getInteractionSchema;