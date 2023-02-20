const express = require("express");
const { signup, signin } = require("../controllers/user.controller");
const { isSignupRequestValidated, isSignInRequestValidated } = require("../middleware/user.validation");
const router = express.Router();

// isSignupRequestValidated ,isSignInRequestValidated is validation middleware method that will checks inputs should not be empty
router.post('/user/signup', isSignupRequestValidated, signup)
router.post('/user/signin', isSignInRequestValidated, signin)
module.exports = router;