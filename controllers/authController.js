import User from "../models/user.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/jwt.js";

export const authController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validasi gagal",
        errors: errors.array().map((error) => {
          return {
            field: error.path,
            message: error.msg,
          };
        }),
      });
    }

    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ username: username });
    const existingEmail = await User.findOne({ email: email });
    if (existingUser || existingEmail) {
      return res.status(400).json({
        status: "error",
        message: "Nama pengguna atau email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      status: "success",
      message: "Pengguna berhasil dibuat",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  },

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validasi gagal",
        errors: errors.array().map((error) => {
          return {
            field: error.path,
            message: error.msg,
          };
        }),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email atau password tidak valid",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Email atau password tidak valid",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  },

  logout: async (req, res) => {
    return res.status(200).json({
      status: "success",
      message: "Logout berhasil",
    });
  },
};
