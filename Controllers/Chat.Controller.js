const { userModel } = require("../Models/User");
module.exports.renderChatPage = (req, res) => {
  res.render("chatPage", { title: "Chat" });
};
module.exports.get_user = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userModel.findOne({ email });
    if (user) {
      user._id = null;
      user.password = null;
      res.json({
        user,
        done: true,
        msg: "done",
      });
    } else {
      res.json({
        notFound: true,
        done: false,
        msg: "not found !",
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
module.exports.get_users = async (req, res) => {
  try {
    const users = await userModel.find({
      $and: [
        { email: { $regex: req.params.val } },
        { email: { $ne: req.params.connectedUser } },
      ],
    });
    res.json({
      done: true,
      users,
    });
  } catch (err) {
    console.log("[EXCEPTION] => ", err);
    res.json({
      done: false,
      msg: err.message,
    });
  }
};
