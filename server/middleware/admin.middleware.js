const asynchandler = require("express-async-handler");
const authenticated = require("./authenticated.middleware");

const admin = asynchandler((req, res, next) => {
  authenticated(req, res, () => {
    if (req.user.role.admin) {
      next();
    } else {
      res
        .send(403)
        .send({ message: "this function is only allowed to admins" });
    }
  });
});

module.exports = admin;
