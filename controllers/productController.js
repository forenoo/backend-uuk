import { validationResult } from "express-validator";
import Product from "../models/product.js";

export const productController = {
  createProduct: async (req, res) => {
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

    const { name, price, stock } = req.body;

    const product = await Product.create({ name, price, stock });
    await product.save();

    return res.status(201).json({
      status: "success",
      message: "Produk berhasil dibuat",
      data: product,
    });
  },

  getProduct: async (req, res) => {
    const products = await Product.find();

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil semua produk",
      data: products,
    });
  },

  getProductById: async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Produk tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil produk",
      data: product,
    });
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({
        status: "error",
        message: "Tidak ada data yang dikirim (name / price / stock)",
      });
    }

    const { name, price, stock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Produk tidak ditemukan",
      });
    }

    if (name) {
      product.name = name;
    }
    if (price) {
      product.price = price;
    }
    if (stock) {
      product.stock = stock;
    }

    await product.save();

    return res.status(200).json({
      status: "success",
      message: "Produk berhasil diubah",
      data: product,
    });
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Produk tidak ditemukan",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      status: "success",
      message: "Produk berhasil dihapus",
    });
  },
};
