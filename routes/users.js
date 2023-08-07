const express = require('express');
const router = express.Router();
const userController = require("../controllers/users");
const{signupSchema,loginSchema} = require("../utils/validator");
const {requestBodyValidator, requestQueryValidator} =require("../utils/index");
const rateLimit = require ("express-rate-limit");

const limiter = rateLimit({
  windowMs:1*60*1000,
  max:1,
  message: "its enough, try again later",
  standardHeader:false,
  legacyHeaders:false,
});

/* GET users listing. */
// router.post("/signup",limiter, requestBodyValidator(signupSchema), userController.signup);
// router.post("/login", requestBodyValidator(loginSchema), userController.login);
// router.get("/", userController.get_users);
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
