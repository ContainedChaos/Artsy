const express = require("express");
const passport = require('passport')
const router = express.Router();
const {
    getLogin,
    getRegister,
    postLogin,
    postRegister,
    getLogout,
    forgotpassword,
    getForgotPass,
    passreset,
    getPassReset,
    } = require("../controllers/auth.controllers");

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/register", getRegister);
router.get("/logout", getLogout);
router.post("/register", postRegister);
router.get("/forgotpassword", getForgotPass);
router.post("/sendotp", forgotpassword);
router.get("/passreset", getPassReset);
router.post("/passwordreset", passreset);

router.get("/auth/google", passport.authenticate('google', {
  successRedirect: '/welcome', // Redirect to a success page
  failureRedirect: '/' // Redirect to the home page or login page on failure
}));


module.exports = router;