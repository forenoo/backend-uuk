import express from "express";
import { authController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { loginValidation, registerValidation } from "../validators/authValidation.js";

const router = express.Router();

router.post("/auth/register", registerValidation, authController.register);
router.post("/auth/login", loginValidation, authController.login);
router.post("/auth/logout", authMiddleware, authController.logout);

export default router;
