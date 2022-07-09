const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
class sendgridHelper {
  static async SENDREGISTRATIONWELCOMEEMAIL(user) {
    const msg = {
      to: user.email,
      from: process.env.VERIFIED_SENDER,
      subject: "WELCOME TO FANAKA PLATINUMS",
      text: "we're glad to have you at FANAKAPLATINUMS, where dreams come true",
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("email sent");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  static async SENDPASSWORDRESETEMAIL(email, token, userId) {
    const msg = {
      to: email,
      from: process.env.VERIFIED_SENDER,
      subject: "PASSWORD RESET EMAIL",
      text: `you're receiving this email because you requested for password reset link. Please follow this link ${process.env.CLIENT_URL}/${userId}/${token}`,
    };
    sgMail
      .send(msg)
      .then(() => {})
      .catch((err) => {
        console.log(err.message);
      });
  }
}

module.exports = sendgridHelper;
