const joi = require("joi");

const editUserValidate = joi.object({
  username: joi.string().min(3).max(20),
  email: joi.string().email(),
  password: joi.string().min(6).max(200),
  role: joi.string().default("traveller"),
});

module.exports = editUserValidate;
