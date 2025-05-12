const { Router } = require("express");
const { default: ctrlWrapper } = require("../utils/ctrlWrapper");
const { googleAuth, googleRedirect } = require("../controller/auth");



const router = Router();

router.get("/google", ctrlWrapper(googleAuth));

router.get("/google-redirect", ctrlWrapper(googleRedirect));

module.exports = router;