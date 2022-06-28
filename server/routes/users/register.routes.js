const express = require("express");
const userModel = require("../../models/user.model");
const registerValidation = require("../../validation/register.validate");
const authtoken = require("../../utils/authtoken");
const sendgridHelper = require("../../middleware/email.middleware");
const Router = express.Router();

Router.post("/", async (req, res) => {
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
  });
  if (user) {
    await sendgridHelper.SENDREGISTRATIONWELCOMEEMAIL(user);
    const token = authtoken(user);
    res.status(200).send({ token: token });
    return;
  }
});

module.exports = Router;
