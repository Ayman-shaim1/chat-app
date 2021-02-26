const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter the first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter the last name"],
  },
  photo: {
    type: String,
    required: [true, "Please enter the photo"],
  },
  phone: {
    type: String,
    required: [true, "Please enter the number phone"],
  },
  country: {
    type: String,
    required: [true, "Please enter the country"],
  },
  city: {
    type: String,
    required: [true, "Please enter the city"],
  },
  isOnLine: {
    type: Boolean,
    required: true,
    default: false,
  },
  lastConnection: {
    type: Date,
  },
  sentMessages: {
    type: Array,
  },
  receivedMessages: {
    type: Array,
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: 6,
  },
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const crppassword = await bcrypt.hash(this.password, salt);
  this.password = crppassword;
  next();
});
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  } else {
    throw Error("incorrect email");
  }
};
const userModel = mongoose.model("user", userSchema);
exports.userModel = userModel;
