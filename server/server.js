const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectdatabase = require("./utils/mongodb");
dotenv.config();
// routers
const register = require("./routes/users/register.routes");
const login = require("./routes/users/login.routes");
const resetpass = require("./routes/users/passwordreset.routes");

// Middlwares
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//--------APPLICATION RESTFUL API'S--------//
// user authentication
app.use("/api/v1/register", register);
app.use("/api/v1/login", login);
app.use("/api/v1/password-reset", resetpass);

// products creations

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
