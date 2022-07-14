const joi = require("joi");

const editUserValidate = joi.object({
  username: joi.string().min(3).max(20),
  email: joi.string().email(),
  password: joi.string().min(6).max(200),
  role: joi.string().default("traveller"),
  is_host: joi.boolean().default(false),
  suspended: joi.boolean().default(false),
});

module.exports = editUserValidate;
