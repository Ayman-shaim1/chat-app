const { userModel } = require("../Models/User");
const jwt = require("jsonwebtoken");
const { messageModel } = require("../Models/Message");
const bcrypt = require("bcrypt");
module.exports.user_connect = async (email) => {
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      await userModel.updateOne(
        { email },
        {
          $set: {
            isOnLine: true,
            lastConnection: null,
          },
        }
      );
    }
  } catch (err) {
    console.log("[EXCEPTION] => ", err._message);
  }
};

module.exports.user_disconnect = async (email) => {
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      await userModel.updateOne(
        { email },
        {
          $set: {
            isOnLine: false,
            lastConnection: Date.now(),
          },
        }
      );
    }
  } catch (err) {
    console.log("[EXCEPTION] => ", err.message);
  }
};
module.exports.send_message = async (message, callback) => {
  try {
    const { messageFrom, messageTo, messageContent } = message;

    const createdMessage = await messageModel.create({
      messageFrom,
      messageTo,
      messageContent,
      messageDate: Date.now(),
      seen: false,
    });
    await userModel.updateOne(
      { email: messageFrom },
      {
        $push: {
          sentMessages: createdMessage,
        },
      }
    );

    await userModel.updateOne(
      { email: messageTo },
      {
        $push: {
          receivedMessages: createdMessage,
        },
      }
    );

    callback({ createdMessage });
  } catch (err) {
    console.log("[EXCEPTION] => ", err.message);
  }
};
