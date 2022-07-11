const express = require("express");
const bookingsModel = require("../../../models/cardbookings.model");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Router = express.Router();

//Stripe Webhook
const endpointSecret = process.env.endpointsecret;
let data;
let eventType;

Router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      data = event.data.object;
      eventType = event.type;
      if (eventType === "checkout.session.completed") {
        stripe.customers
          .retrieve(data.customer)
          .then(async (customer) => {
            const ITEMS = JSON.parse(customer.metadata.bookings);
            await bookingsModel.create({
              user: customer.metadata.userId,
              phone_number: customer.phone,
              billing_details: data.customer_details,
              total_amount:
                (data.amount_subtotal / 1000) * ITEMS.map((item) => item.days),
              bookings: ITEMS,
            });
            console.log(data.id);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    } catch (err) {
      response.status(400).json(`Webhook Error: ${err.message}`);
      console.log(`Webhook Error: ${err.message}`);
      return;
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
  }
);

module.exports = Router;
