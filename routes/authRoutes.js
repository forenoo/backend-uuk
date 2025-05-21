import express from "express";
import { authController } from "../controllers/authController.js";
import { checkAuthMiddleware } from "../middlewares/checkAuthMiddleware.js";
import { loginValidator, registerValidator } from "../validator/validator.js";
const router = express.Router();

router.post("/auth/register", registerValidator, authController.register);
router.post("/auth/login", loginValidator, authController.login);
router.post("/auth/logout", checkAuthMiddleware, authController.logout);

export default router;
