const Joi = require("joi");
const signupSchema = Joi.object({
name: Joi.string().alphanum().min(3).max(30).required(),
// password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
password: Joi.string().required(),
email: Joi.string().required().email({ minDomainSegments: 2 }),
Account_type:Joi.string().required().valid("individual", "business"),
});
const loginSchema = Joi.object({
password: Joi.string().required(),
email: Joi.string().email({ minDomainSegments: 2 }),
});

module.exports = {signupSchema, loginSchema};