const express = require("express");
const sendgridHelper = require("../../middleware/email.middleware");
const userModel = require("../../models/user.model");
const authtoken = require("../../utils/authtoken");
const registerValidation = require("../../validation/user/register.validate");
const loginValidation = require("../../validation/user/login.validate");
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

module.exports = Router;
