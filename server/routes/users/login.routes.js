const express = require("express");
const userModel = require("../../models/user.model");
const authtoken = require("../../utils/authtoken");
const loginValidation = require("../../validation/login.validate");
const Router = express.Router();

Router.post("/", async (req, res) => {
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
