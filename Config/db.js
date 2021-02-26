const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      })
      .then(() => console.log(`Mongo DB Connected`.cyan.underline));
  } catch (error) {
    console.error(`Error : ${error.message}`.red.underline.bold);
  }
};
module.exports = connectDB;
