const express = require("express");
const chatController = require("../Controllers/Chat.Controller");
const router = express.Router();
const { requireAuth,requireAuth_req_irr } = require("../Middlewares/Auth.Middleware");

router.get("/", requireAuth, chatController.renderChatPage);
router.get("/Chat", requireAuth, chatController.renderChatPage);
router.get("/getUser/:email", requireAuth_req_irr,chatController.get_user);
router.get("/getUsers/:val/:connectedUser",requireAuth_req_irr,chatController.get_users);
module.exports = router;
