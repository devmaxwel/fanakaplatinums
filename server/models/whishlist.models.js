const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    wishlist: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
const wishlistModel = mongoose.model("bookings", wishlistSchema);
module.exports = wishlistModel;
