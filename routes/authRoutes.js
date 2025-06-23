const express = require("express");
const passport = require("../config/passport");
const {
  register,
  login,
  verifyUser,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verification", verifyUser);
router.post("/resend-verification", verifyUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleLogin
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  facebookLogin
);

module.exports = router;
