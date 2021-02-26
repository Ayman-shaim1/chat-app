const express = require("express");
const router = express.Router();
const messageController = require("../Controllers/Message.Controller");
const {
  requireAuth,
  requireAuth_req_irr,
} = require("../Middlewares/Auth.Middleware");
const { messageModel } = require("../Models/Message");

router.post("/sendMessage", messageController.send_message);

router.get(
  "/getLastMessages/:email",
  requireAuth_req_irr,
  messageController.get_last_messages
);

router.get(
  "/getConvertationMessages/:connectedUser/:otherUser",
  requireAuth_req_irr,
  messageController.get_convertation_messages
);
router.get(
  "/getUser_newConvertaion/:messageFrom",
  requireAuth_req_irr,
  messageController.getUser_newConvertaion
);
router.put(
  "/seenAllMessages/:connectedUser_email/:otherUser_email",
  requireAuth_req_irr,
  messageController.seen_all_messages
);
router.delete(
  "/deleteConvertation/:connectedUser_email/:otherUser_email",
  requireAuth_req_irr,
  messageController.delete_convertation
);
router.delete(
  "/deleteMessage",
  requireAuth_req_irr,
  messageController.delete_message
);
module.exports = router;
