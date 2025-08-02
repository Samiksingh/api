import express from "express";
import isAuth from "../middleware/auth.js";
import getUser from "../controller/user.controller.js"

const router = express.Router()
router.get("/", isAuth, getUser);

export default router;