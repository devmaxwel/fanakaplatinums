const asynchandler = require("express-async-handler");
const authenticated = require("./authenticated.middleware");

const admin = asynchandler((req, res, next) => {
  authenticated(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).send({
        message: "this function is only allowed to fanakapaltinums admins",
      });
    }
  });
});

module.exports = admin;
