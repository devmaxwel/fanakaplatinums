const joi = require("joi");

const registerValidation = joi.object({
  username: joi.string().min(3).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(200).required(),
  role: joi.string().default("traveller"),
  suspended: joi.boolean().default(false),
});

module.exports = registerValidation;
