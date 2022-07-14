const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectdatabase = require("./config/mongodb");
const bodyParser = require("body-parser");

// routers
const user = require("./routes/users/user.routes");
const product = require("./routes/products/products.routes");
const payment = require("./routes/payment/payment.routes");
const wishlist = require("./routes/wishlist/wishlist.routes");
const stripewebhook = require("./routes/payment/webhooks/stripewebhook");
const mpesawebhook = require("./routes/payment/webhooks/mpesawebhook");
const authenticated = require("./middleware/authenticated.middleware");

const app = express();

// Cors Middleware
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin");
  next();
});
// Webhooks
app.use("/api/v5", stripewebhook);
// Body Parser Middlewares
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "200mb",
    parameterLimit: 20000,
  })
);

//--------APPLICATION RESTFUL API'S--------//
app.use("/api/v1", user);
app.use("/api/v2", product);
app.use("/api/v3", payment);
app.use("/api/v4", wishlist);
app.use("/api/v6", mpesawebhook);

// Use JSON parser for all non-webhook routes

// -------APPLICATION HOSTING------------//
app.get("/", (req, res) => {
  res.status(200).json("server is up and running");
});

// Server Initialization
const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`server is running at http://localhost:${PORT}`);
  await connectdatabase();
});
