const asynchandler = require("express-async-handler");
const authenticated = require("./authenticated.middleware");

const host = asynchandler((req, res, next) => {
  authenticated(req, res, () => {
    if (req.user.is_host) {
      next();
    } else {
      res.status(403).json({
        message: "this function is only allowed to fanakaplatinums hosts",
      });
    }
  });
});

module.exports = host;
