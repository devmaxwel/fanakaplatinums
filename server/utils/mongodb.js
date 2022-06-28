const mongoose = require("mongoose");

async function connectdatabase() {
  const DB_URI = process.env.DB_URI;
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info("mongodb connected successfully");
  } catch (error) {
    console.error(`an error occured during connection: ${error.message}`);
  }
}
module.exports = connectdatabase;
