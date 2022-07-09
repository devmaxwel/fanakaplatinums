const express = require("express");
const userModel = require("../../models/user.model");
const authtoken = require("../../utils/authtoken");
const registerValidation = require("../../validation/user/register.validate");
const loginValidation = require("../../validation/user/login.validate");
const resetValidation = require("../../validation/user/reset.validate");
const tokenModel = require("../../models/token.model");
const resetPasswordValidation = require("../../validation/user/resetpassword.validate");
const editUserValidate = require("../../validation/user/edituser.validate");
const sendgridHelper = require("../../helpers/email.middleware");
const Router = express.Router();

// CREATE USER
Router.post("/register", async (req, res) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("user with this email already exist");
  }
  user = await userModel.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  if (user) {
    await sendgridHelper.SENDREGISTRATIONWELCOMEEMAIL(user);
    const token = authtoken(user);
    res.status(200).send({ token: token });
    return;
  }
});

// LOGIN USER

Router.post("/login", async (req, res) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send("user with this email not found");
  } else if (user && (await user.matchpassword(req.body.password))) {
    const token = authtoken(user);
    res.status(200).send({ token: token });
  } else {
    res.status(400).send("password provided failed to decrypt your account");
  }
});

// GET ALL USERS PROTECTED BY ADMIN
Router.get("/getallusers", async (req, res) => {
  try {
    const users = await userModel.find();
    if (users) {
      return res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE USER
Router.get("/find/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (user) {
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE USERS PROTECTED BY ADMIN
Router.put("/:id", async (req, res) => {
  const { error } = editUserValidate.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "user updatated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SEND_RESET_LINK
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

// GET THE REGISTRATION FORM
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

// SAVE PASSWORD
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
