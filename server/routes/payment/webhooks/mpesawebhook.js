const express = require("express");
const prettyjson = require("prettyjson");
const Router = express.Router();

Router.post("/stk-webhook", async (req, res) => {
  let CallbackMetadata;
  let ResultCode;
  let errorrResponse;

  console.log("_____________RECEIVED_MPESA_WEBHOOK________");
  console.log(prettyjson.render(req.body));
  try {
    ResultCode = req.body.Body.stkCallback.ResultCode;
    if (ResultCode === 0) {
      CallbackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;
    } else {
      errorrResponse = req.body.Body.stkCallback.ResultDesc;
      console.log(errorrResponse);
    }
    if (ResultCode === 0) {
      function mapMetadata(metadata) {
        return metadata.reduce((result, entry) => {
          result[entry.Name] = entry.Value;
          return result;
        }, {});
      }

      const mappedResult = mapMetadata(CallbackMetadata);
      let { Amount, MpesaReceiptNumber, TransactionDate, PhoneNumber } =
        mappedResult;

      // Save Request Body to MongoDB
    } else {
      console.log("You cancelled transaction");
      res.status(400).json({ message: "you cancelled transaction" });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = Router;
