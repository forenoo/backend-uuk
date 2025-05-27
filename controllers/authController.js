import Customer from "../models/customer.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { validationResult } from "express-validator";

export const authController = {
  register: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.array(),
      });
    }

    const { username, password, address, phone_number } = req.body;
    const existingUser = await Customer.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username sudah ada",
      });
    }

    const dataCustomer = {
      username,
      password,
    };

    if (address) {
      dataCustomer.address = address;
    }
    if (phone_number) {
      dataCustomer.phone_number = phone_number;
    }

    const newCustomer = await Customer.create(dataCustomer);
    const token = generateToken(newCustomer, "user");
    const hashedPassword = await bcrypt.hash(password, 10);
    newCustomer.password = hashedPassword;
    await newCustomer.save();

    res.status(201).json({
      message: "Berhasil melakukan registrasi",
      data: {
        user: {
          id: newCustomer._id,
          username: newCustomer.username,
          address: newCustomer.address,
          phone_number: newCustomer.phone_number,
          role: "user",
        },
        token,
      },
    });
  },

  login: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.array(),
      });
    }

    const { username, password } = req.body;

    let user = await Customer.findOne({ username });
    let role = "user";
    if (!user) {
      user = await User.findOne({ username });
      role = "admin";
    }
    if (!user) {
      return res.status(400).json({
        message: "Username atau password salah",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Username atau password salah",
      });
    }

    const token = generateToken(user, role);

    res.status(200).json({
      message: "Berhasil melakukan login",
      data: {
        user: {
          id: user._id,
          username: user.username,
          address: user.address,
          phone_number: user.phone_number,
          role,
        },
        token,
      },
    });
  },

  logout: async (req, res) => {
    res.status(200).json({
      message: "Berhasil melakukan logout",
    });
  },
};
