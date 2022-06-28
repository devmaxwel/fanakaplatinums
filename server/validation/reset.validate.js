const joi = require("joi");

const resetValidation = joi.object({
  email: joi.string().email().required(),
});

module.exports = resetValidation;
