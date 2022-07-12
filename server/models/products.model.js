const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
  hosting_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  property_name: {
    type: String,
    required: true,
  },
  property_location: {
    type: String,
    required: true,
  },
  property_description: {
    type: String,
    required: true,
  },
  property_price: {
    type: Number,
    required: true,
  },
  property_amenities: {
    type: Array,
    required: true,
  },
  property_images: {
    type: Array,
    required: true,
  },
});

const productsModel = mongoose.model("houses", productsSchema);
module.exports = productsModel;
