const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth");
const {upload} = require("../helpers/index");
const multer = require ("multer");
const {signupSchema} = require("../utils/validator");
const {requestBodyValidator}= require("../utils/index");
const {authToken} = require('../middlewares/index');

/* GET home page. */
router.post("/signup", requestBodyValidator(signupSchema),  authController.signup);
router.post("/login",   authController.login);

router.post("/signup", authController.signup_user);
router.get("/signup", authController.signup_get);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

router.post('/complete-profile/business',  authToken,authController.complete_profile_business);
router.post('/complete-profile/individual', authToken, authController.complete_profile_individual);

router.post('/upload', upload.single("image"), authController.upload_file);

module.exports = router;