const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string(),

    email: Joi.string().email(),

    phone: Joi.string(),

    favorite: Joi.boolean()

});

module.exports = { schema };