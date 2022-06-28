const joi = require("joi");

const resetPasswordValidation = joi.object({
  password: joi.string().min(8).max(200).required(),
});

module.exports = resetPasswordValidation;
