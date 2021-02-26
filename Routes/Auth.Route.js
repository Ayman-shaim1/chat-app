const { Router } = require("express");
const router = Router();
const authController = require("../Controllers/Auth.Controller");
const {
  requireNotAuth,
  requireAuth,
  requireAuth_req_irr,
} = require("../Middlewares/Auth.Middleware");

router.get("/signup", requireNotAuth, authController.signup_get);
router.post("/signup", requireNotAuth, authController.signup_post);
router.get("/login", requireNotAuth, authController.login_get);
router.post("/login", requireNotAuth, authController.login_post);
router.post("/logout", authController.logout_post);
router.get("/update", requireAuth, authController.render_update_page);

// update user data :
router.post(
  "/changePhoto",
  requireAuth_req_irr,
  authController.change_photo_post
);
router.post(
  "/changeInfo",
  requireAuth_req_irr,
  authController.change_user_info_post
);
router.post(
  "/changePassword",
  requireAuth_req_irr,
  authController.change_password_post
);

module.exports = router;
