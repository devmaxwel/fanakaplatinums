const express = require("express");
const moment = require("moment");
const request = require("request");
const admin = require("../../middleware/admin.middleware");
const authenticated = require("../../middleware/authenticated.middleware");
const passwordbase64 = require("../../utils/basesixfour");
const access_token = require("../../utils/mpesaaccesstoken");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Router = express.Router();

// PAYMENT BY CARD
Router.post("/create-checkout-session", authenticated, async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        bookings: JSON.stringify(req.body.bookings),
      },
    });

    const line_items = req.body.bookings.map((booking) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.name,
            description: booking.description,
            images: [booking.image],
            metadata: {
              id: booking._id,
            },
          },
          unit_amount: booking.price * 100,
        },
        quantity: booking.days,
      };
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking-success`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500);
    res.json({ error: error.message });
  }
});

// MPESA ACCESS_TOKEN

Router.get("/access-token", access_token, (req, res) => {
  res.status(200).json({ access_token: req.access_token });
});

// PAYMENT BY MPESA
Router.post("/initiate-mpesastk-push", access_token, (req, res) => {
  let url = process.env.ENDPOINT_STK_PUSH_SERVIRCE_URL;
  let auth = "Bearer " + req.access_token;
  const timeStamp = moment().format("YYYYMMDDHHmmss");
  const passKey = process.env.LNMP_PASS_KEY;
  const shortCode = process.env.LNMP_SHORTCODE;
  const password = passwordbase64(shortCode, passKey, timeStamp);

  request(
    {
      url: url,
      method: "POST",
      headers: {
        Authorization: auth,
      },
      json: {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timeStamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: req.body.amount,
        PartyA: req.body.number,
        PartyB: shortCode,
        PhoneNumber: req.body.number,
        CallBackURL:
          "https://7001-2c0f-fe38-224c-2c0e-c512-74a0-5f80-52c7.ngrok.io/api/v6/stk-webhook",
        AccountReference: "RARI_PAY",
        TransactionDesc: "Crypto Transactions",
      },
    },
    (err, resp, body) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json(body);
    }
  );
});

// PAY HOSTS USING MPESA B2C
Router.post("/initiate_business2customer_payment", (req, res) => {});

module.exports = Router;
