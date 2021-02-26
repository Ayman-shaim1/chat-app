const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  messageFrom: {
    required: true,
    type: String,
    ref: "User",
  },
  messageTo: {
    required: true,
    type: String,
    ref: "User",
  },
  messageContent: {
    required: true,
    type: String,
  },
  messageDate: {
    type: Date,
    required: true,
  },
  seen: {
    required: true,
    type: Boolean,
  },
});

const messageModel = mongoose.model("message", messageSchema);
exports.messageModel = messageModel;
