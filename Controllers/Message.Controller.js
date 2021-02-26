const { messageModel } = require("../Models/Message");
const { userModel } = require("../Models/User");
const bcrypt = require("bcrypt");

module.exports.send_message = async (req, res) => {
  const { messageFrom, messageTo, messageContent } = req.body;

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

  res.json({
    done: true,
    message: createdMessage,
  });
};
module.exports.get_last_messages = async (req, res) => {
  try {
    const connected_user_email = req.params.email;
    const dataToSend = [];
    const connected_user = await userModel.findOne({
      email: connected_user_email,
    });

    const Messages = connected_user.receivedMessages.concat(
      connected_user.sentMessages
    );
    Messages.sort(function (a, b) {
      return b.messageDate - a.messageDate;
    });

    for (let i = 0; i <= Messages.length - 1; i++) {
      const user = await userModel.findOne({
        $and: [
          {
            $or: [
              { email: Messages[i].messageFrom },
              { email: Messages[i].messageTo },
            ],
          },
          {
            email: { $ne: connected_user_email },
          },
        ],
      });

      if (user) {
        user.receivedMessages = null;
        user.sentMessages = null;
        const index = dataToSend.findIndex((x) => x.user.email == user.email);
        if (index != -1) {
          dataToSend[index].messages.push(Messages[i]);
        } else {
          user._id = null;
          user.password = null;
          let last_messages = [];
          last_messages.push(Messages[i]);
          dataToSend.push({
            user: user,
            messages: last_messages,
          });
        }
      }
    }

    res.json({
      done: true,
      data: dataToSend,
    });
  } catch (err) {
    console.log("[EXCEPTION] => ", err.message);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};
module.exports.get_convertation_messages = async (req, res) => {
  try {
    const connectedUser = req.params.connectedUser;
    const otherUser = req.params.otherUser;

    const user = await userModel.findOne({ email: connectedUser });
    const otherUser_toSend = await userModel.findOne({ email: otherUser });

    const srv_messages = user.receivedMessages.concat(user.sentMessages);
    const messages = srv_messages.filter(
      (u) =>
        (u.messageFrom == otherUser || u.messageTo == otherUser) &&
        (u.messageFrom == connectedUser || u.messageTo == connectedUser)
    );
    messages.sort((a, b) => {
      return a.messageDate - b.messageDate;
    });

    res.json({
      done: true,
      messages,
      user: otherUser_toSend,
    });
  } catch (err) {
    console.log("[EXCEPTION] => ", err);

    res.json({
      done: false,
      msg: err.message,
    });
  }
};
module.exports.getUser_newConvertaion = async (req, res) => {
  try {
    const messageFrom = req.params.messageFrom;
    const senderUser = await userModel.findOne({ email: messageFrom });
    if (senderUser) {
      res.json({
        done: true,
        senderUser,
        notfound: false,
      });
    } else {
      res.json({
        done: true,
        notfound: true,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};
module.exports.seen_all_messages = async (req, res) => {
  try {
    const connectedUser_email = req.params.connectedUser_email;
    const otherUser_email = req.params.otherUser_email;

    const newReceivedMessages = [];
    const newSentMessages = [];
    await messageModel.updateMany(
      {
        $and: [
          { messageFrom: otherUser_email },
          { messageTo: connectedUser_email },
          { seen: false },
        ],
      },
      {
        $set: {
          seen: true,
        },
      }
    );
    // userModel
    //   .findOne({ email: connectedUser_email })
    //   .then((doc) => {
    //     doc.sentMessages[0].seen = true;
    //     doc.save();
    //   })
    //   .catch((err) => {
    //     res.json({
    //       done: false,
    //       msg: err.message,
    //     });
    //   });
    const connectedUser = await userModel.findOne({
      email: connectedUser_email,
    });

    const otherUser = await userModel.findOne({
      email: otherUser_email,
    });
    // connected User :
    for (let i = 0; i < connectedUser.receivedMessages.length; i++) {
      const message = connectedUser.receivedMessages[i];
      if (
        (message.messageFrom == connectedUser_email &&
          message.messageTo == otherUser_email) ||
        (message.messageFrom == otherUser_email &&
          message.messageTo == connectedUser_email)
      ) {
        message.seen = true;
      }
      newReceivedMessages.push(message);
    }
    // other User :
    for (let i = 0; i < otherUser.sentMessages.length; i++) {
      const message = otherUser.sentMessages[i];
      if (
        (message.messageFrom == connectedUser_email &&
          message.messageTo == otherUser_email) ||
        (message.messageFrom == otherUser_email &&
          message.messageTo == connectedUser_email)
      ) {
        message.seen = true;
      }
      newSentMessages.push(message);
    }
    await userModel.updateOne(
      { email: connectedUser_email },
      {
        $set: {
          receivedMessages: newReceivedMessages,
        },
      }
    );

    await userModel.updateOne(
      { email: otherUser_email },
      {
        $set: {
          sentMessages: newSentMessages,
        },
      }
    );

    res.json({
      done: true,
      msg: "done",
    });
  } catch (err) {
    console.log("[EXCEPTION] => ", err.message);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};
module.exports.delete_convertation = async (req, res) => {
  try {
    const connectedUser_email = req.params.connectedUser_email;
    const otherUser_email = req.params.otherUser_email;

    const newReceivedMessages = [];
    const newSentMessages = [];

    const connectedUser = await userModel.findOne({
      email: connectedUser_email,
    });

    for (let i = 0; i < connectedUser.receivedMessages.length; i++) {
      const message = connectedUser.receivedMessages[i];
      const messageFrom = message.messageFrom;
      const messageTo = message.messageTo;
      const existe =
        messageFrom == otherUser_email && messageTo == connectedUser_email;
      if (!existe) {
        newReceivedMessages.push(message);
      }
    }

    for (let i = 0; i < connectedUser.sentMessages.length; i++) {
      const message = connectedUser.sentMessages[i];
      const messageFrom = message.messageFrom;
      const messageTo = message.messageTo;
      const existe =
        messageTo == otherUser_email && messageFrom == connectedUser_email;
      if (!existe) {
        newSentMessages.push(message);
      }
    }

    await userModel.updateOne(
      { email: connectedUser_email },
      {
        $set: {
          receivedMessages: newReceivedMessages,
          sentMessages: newSentMessages,
        },
      }
    );

    res.json({
      done: true,
      msg: "done",
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};
module.exports.delete_all_messages = async (req, res) => {
  await messageModel.deleteMany();
  res.json({
    done: true,
  });
};
module.exports.delete_message = async (req, res) => {
  try {
    const {
      connectedUser_email,
      otherUser_email,
      targetedMessageDate,
      isTheSender,
    } = req.body;

    const newSentMessages = [];
    const newReceivedMessages = [];
    const connectedUser = await userModel.findOne({
      email: connectedUser_email,
    });
    if (connectedUser_email && otherUser_email) {
      if (isTheSender) {
        for (let i = 0; i < connectedUser.sentMessages.length; i++) {
          const message = connectedUser.sentMessages[i];
          const messageFrom = message.messageFrom;
          const messageTo = message.messageTo;
          const messageDate = message.messageDate;
          const ex_message =
            messageFrom == connectedUser_email &&
            messageTo == otherUser_email &&
            new Date(messageDate).toString() ==
              new Date(targetedMessageDate).toString();

          if (!ex_message) {
            newSentMessages.push(message);
          }
        }
        await userModel.updateOne(
          { email: connectedUser_email },
          {
            $set: {
              sentMessages: newSentMessages,
            },
          }
        );
        return res.json({
          done: true,
          msg: "done",
        });
      } else {
        for (let i = 0; i < connectedUser.receivedMessages.length; i++) {
          const message = connectedUser.receivedMessages[i];
          const messageFrom = message.messageFrom;
          const messageTo = message.messageTo;
          const messageDate = message.messageDate;
          const ex_message =
            messageFrom == otherUser_email &&
            messageTo == connectedUser_email &&
            new Date(messageDate).toString() ==
              new Date(targetedMessageDate).toString();

          if (!ex_message) {
            newReceivedMessages.push(message);
          } 
        }
        await userModel.updateOne(
          { email: connectedUser_email },
          {
            $set: {
              receivedMessages: newReceivedMessages,
            },
          }
        );
        return res.json({
          done: true,
          msg: "done",
        });
      }
    }
    return res.json({
      done: true,
      msg: "done",
    });
  } catch (err) {
    console.log("[EXCEPTION] => ", err.message);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};
