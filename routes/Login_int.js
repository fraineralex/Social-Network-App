const express = require("express");

const router = express.Router();

const login_intController = require("../controllers/LoginController");

router.get("/login", login_intController.GetLogin);
router.post("/login", login_intController.PostLogin);
router.post("/logout", login_intController.PostLogout);
router.get("/login_up", login_intController.GetLogin_up);
router.post("/login_up", login_intController.PostLogin_up);

router.get("/reset", login_intController.GetReset);
router.post("/reset", login_intController.PostReset);

router.get("/reset/:token", login_intController.GetNewPassword);
router.post("/new-password", login_intController.PostNewPassword);

module.exports =router;
