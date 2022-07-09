const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectdatabase = require("./utils/mongodb");
const bodyParser = require("body-parser");

// routers
const user = require("./routes/users/user.routes");
const product = require("./routes/products/products.routes");
const payment = require("./routes/payment/payment.routes");

// Middlwares
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 10000,
  })
);
app.use(bodyParser.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin");
  next();
});

//--------APPLICATION RESTFUL API'S--------//
// user authentication midleware
app.use("/api/v1", user);
// product middleware
app.use("/api/v2", product);
// payment & booking middleware
app.use("/api/v3", payment);
//--------APPLICATION RESTFUL API'S--------//

// -------APPLICATION HOSTING------------//

app.get("/", (req, res) => {
  res.status(200).json("server is up and running");
});

// -------APPLICATION HOSTING------------//

// Server Initialization
const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`server is running at http://localhost:${PORT}`);
  await connectdatabase();
});
