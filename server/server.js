const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectdatabase = require("./utils/mongodb");

// routers
const user = require("./routes/users/user.routes");
const userreset = require("./routes/users/userreset.routes");
const product = require("./routes/products/products.routes");
const payment = require("./routes/payment/payment.routes");

// Middlwares
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//--------APPLICATION RESTFUL API'S--------//
// user authentication midleware
app.use("/api/v1", user);
app.use("/api/v1/reset-password", userreset);
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
