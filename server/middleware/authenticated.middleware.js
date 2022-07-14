const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");

const authenticated = asynchandler((req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const secret_key = process.env.SECRET_KEY;
      const decoded_user = jwt.verify(token, secret_key);
      req.user = decoded_user;
      next();
    } catch (ex) {
      res.status(400).send({
        message: "your authenication process failed, invalid access token",
      });
    }
  } else {
    return res.status(401).send({
      message: "this function is only allowed to authenticated users",
    });
  }
});

module.exports = authenticated;
