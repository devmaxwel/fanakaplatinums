const express = require("express");
const request = require('request')
const admin = require("../../middleware/admin.middleware");
const authenticated = require("../../middleware/authenticated.middleware");
const Router = express.Router();

// PAYMENT BY CARD
Router.post("/create_checkout_session", authenticated, (req, res) => {

});

// PAYMENT BY MPESA
Router.post("/initiate_mpesastk_push", authenticated, (req, res) => {});

// PAY HOSTS USING MPESA B2C
Router.post("/initiate_business2customer_payment", admin, (req, res) => {});

module.exports = Router;