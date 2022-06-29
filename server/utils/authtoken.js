const jwt = require("jsonwebtoken");

const authtoken = (user) => {
  const secret_key = process.env.SECRET_KEY;
  const token = jwt.sign(
    { id: user._id, role: user.admin, name: user.username, email: user.email },
    secret_key,
    {
      expiresIn: "20d",
    }
  );
  return token;
};

module.exports = authtoken;
