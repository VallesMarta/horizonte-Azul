import express from "express";
import { logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/", logoutUser);

export default router;
