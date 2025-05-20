import Joi from "joi";
import Customer from "../models/customer.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

export const authController = {
  register: async (req, res) => {
    const validation = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      address: Joi.string().optional(),
      phone_number: Joi.string().optional(),
    });

    const { error } = validation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
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
    const token = generateToken(newCustomer);
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
        },
        token,
      },
    });
  },

  login: async (req, res) => {
    const validation = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = validation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const { username, password } = req.body;
    const existingUser = await Customer.findOne({ username });
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!existingUser || !isPasswordValid) {
      return res.status(400).json({
        message: "Username atau password salah",
      });
    }

    const token = generateToken(existingUser);

    res.status(200).json({
      message: "Berhasil melakukan login",
      data: {
        user: {
          id: existingUser._id,
          username: existingUser.username,
          address: existingUser.address,
          phone_number: existingUser.phone_number,
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
