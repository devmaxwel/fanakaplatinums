const express = require("express");
const authenticated = require("../../../middleware/authenticated.middleware");
const bookingsModel = require("../../../models/cardbookings.model");
const Router = express.Router();

Router.post("/mpesa-stk-webhook", async (req, res) => {
  let CallbackMetadata;
  let ResultCode;
  let errorrResponse;

  try {
    ResultCode = req.body.Body.stkCallback.ResultCode;
    if (ResultCode === 0) {
      CallbackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;
    } else {
      errorrResponse = req.body.Body.stkCallback.ResultDesc;
      return;
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
      let date = new Date(
        TransactionDate.replace(
          /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
          "$4:$5:$6 $2/$3/$1"
        )
      );
      let billing_details = {
        receipt: MpesaReceiptNumber,
        date_of_tranasaction: date,
        phone_number: PhoneNumber,
      };
      await bookingsModel
        .create({
          booking_user_id: req.user.id,
          total_amount: Amount,
          billing_details: billing_details,
          phone_number: PhoneNumber,
          user: req.body.userId,
          bookings: req.body.bookings,
        })
        .then(() => {
          // update host revenue database
          // update payments table
        })
        .catch((err) => {
          // if error occurs, send it to user
        });
    } else {
      res.status(400).json({ message: errorrResponse });
      console.log("your transaction was not compeletd");
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = Router;
