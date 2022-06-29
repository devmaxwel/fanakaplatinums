const joi = require("joi");

const productValidation = joi.object({
  name: joi.string().min(5).max(20).required(),
  location: joi.string().min(5).max(100),
  description: joi.string().min(10).max(200).required(),
  price: joi.number().required(),
  image: joi.array().required(),
  amenities: joi.array().required(),
});

module.exports = productValidation;
