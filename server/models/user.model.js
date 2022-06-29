const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      unique: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      default: "traveller",
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const hash = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, hash);
  }
});
userSchema.methods.matchpassword = async function (candidatepassword) {
  return await bcrypt.compare(candidatepassword, this.password).catch(() => {
    return false;
  });
};
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;

