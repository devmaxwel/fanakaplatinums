const jwt = require("jsonwebtoken");

const authtoken = (user) => {
  const secret_key = process.env.SECRET_KEY;
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      is_host: user.is_host,
      name: user.username,
      email: user.email,
      suspended: user.suspended,
    },
    secret_key,
    {
      expiresIn: "30d",
    }
  );
  return token;
};

module.exports = authtoken;
