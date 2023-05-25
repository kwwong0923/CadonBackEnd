const Joi = require("joi");

const registerValidation = (data) =>
{
    const schema = Joi.object(
        {
            username: Joi.string().max(50).required(),
            email: Joi.string().required().email(),
            password: Joi.string().min(6).max(255).required()
        }
    )
    return schema.validate(data)
};

const loginValidation = (data) =>
{
    const schema = Joi.object(
        {
            email: Joi.string().required().email(),
            password: Joi.string().min(6).max(255).required(),
        }
    )
    return schema.validate(data);
};

const postValidation = (data) =>
{
    const schema = Joi.object(
        {
            title: Joi.string().min(3).max(100).required(),
            content: Joi.string().required(),
            category: Joi.string().required().valid("Travel", "Food", "Game", "News", "Sport", "Music", "Other")
        }
    )
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;