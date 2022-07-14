const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    booking_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    booked_house_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "houses",
    },
    booking_details: { type: Array, required: true },
    phone_number: { type: String, required: true },
    billing_details: { type: Object, required: true },
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
