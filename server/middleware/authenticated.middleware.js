const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");

const authenticated = asynchandler((req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ message: "authorization failed" });
  }
  try {
    const secret_key = process.env.SECRET_KEY;
    const decoded_user = jwt.verify(token, secret_key);
    req.user = decoded_user;
    next();
  } catch (ex) {
    res.status(400).send({ message: "invalid authorization token" });
  }
});

module.exports = authenticated;
