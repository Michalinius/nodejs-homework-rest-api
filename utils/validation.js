const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string(),

    email: Joi.string().email(),

    phone: Joi.string()

});

module.exports = { schema };