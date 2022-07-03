const express = require("express");
const tokenModel = require("../../models/token.model");
const userModel = require("../../models/user.model");
const crypto = require("crypto");
const resetPasswordValidation = require("../../validation/user/resetpassword.validate");
const sendgridHelper = require("../../middleware/email.middleware");
const resetValidation = require("../../validation/user/reset.validate");
const Router = express.Router();

// Send reset-link
Router.post("/reset-link", async (req, res) => {
  const { error } = resetValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({ message: "email not found" });
  }

  let token = await tokenModel.findOne({ userId: user._id });
  if (!token) {
    token = await new tokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
  }
  await sendgridHelper.SENDPASSWORDRESETEMAIL(
    user.email,
    token.token,
    user._id
  );
  res
    .status(200)
    .json({ message: "password reset link has been sent to your email" });
});

// Get the registration form
Router.get("/:userid/:token", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userid);
    if (!user) {
      return res.status(400).send("invalid link or token has expired");
    }

    const token = await tokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res
        .status(400)
        .json({ message: "invalid link or token has expired" });
    }
    res.status(200).json({ message: "invalid link or expired" });
  } catch (error) {
    res.status(500).json({ message: "an error occured" });
  }
});

// Save Password
Router.post("/:userid/:token", async (req, res) => {
  try {
    const { error } = resetPasswordValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const user = await userModel.findById(req.params.userid);
    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid link or token has expired" });
    }

    const token = await tokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ message: "invalid link or expired" });
    }
    
    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.status(200).json({ message: "password reset sucessfully." });
  } catch (error) {
    res.status(500).json({ message: "an error occured" });
  }
});
module.exports = Router;
