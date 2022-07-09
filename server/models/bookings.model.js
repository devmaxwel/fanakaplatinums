const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bookings: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);
const bookingsModel = mongoose.model("bookings", bookingSchema);
module.exports = bookingsModel;
