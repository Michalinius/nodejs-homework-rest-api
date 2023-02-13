const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string(),

    email: Joi.string().email(),

    phone: Joi.string(),

    favorite: Joi.boolean()

});

const userSchema = Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),

    email: Joi.string().email(),

    subscription: Joi.string(),

    token: Joi.string()

});


module.exports = { schema, userSchema };