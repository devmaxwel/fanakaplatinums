const request = require("request");
const authBase64 = require("./authsbasesixfour");

const access_token = (req, _res, next) => {
  let endpoint_url = process.env.MPESA_GET_AUTH_CREDENTIALS;
  let auth = authBase64(
    process.env.MPESA_CONSUMER_KEY,
    process.env.MPESA_SECRET_KEY
  );

  request(
    {
      url: endpoint_url,
      headers: {
        Authorization: "Basic " + auth,
      },
    },
    (error, _response, body) => {
      if (error) {
        console.log(error);
      } else {
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
};

module.exports = access_token;
