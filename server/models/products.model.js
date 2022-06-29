const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amenities: {
    type: Array,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
});

const productsModel = mongoose.model("houses", productsSchema);
module.exports = productsModel;
