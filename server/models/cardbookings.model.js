const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    bookings: { type: Array, required: true },
    phone_number: { type: String },
    billing_details: { type: Object },
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);
const bookingsModel = mongoose.model("card-booking", bookingSchema);
module.exports = bookingsModel;
