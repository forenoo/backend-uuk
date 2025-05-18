import { body } from "express-validator";

export const registerValidation = [
  body("username").notEmpty().withMessage("Username tidak boleh kosong"),
  body("email").notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
  body("password").notEmpty().isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
  body("role").optional().isIn(["admin", "user"]).withMessage("Role hanya bisa admin atau user"),
];

export const loginValidation = [
  body("email").notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
  body("password").notEmpty().withMessage("Password tidak boleh kosong"),
];
