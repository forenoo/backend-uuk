import Product from "../models/product.js";
import { validationResult } from "express-validator";

export const productController = {
  createProduct: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.array(),
      });
    }

    try {
      const { name, price, stock, type, image_url, category_id } = req.body;

      const newProduct = new Product({
        name,
        price,
        stock,
        type,
        image_url,
        category_id,
      });

      const savedProduct = await newProduct.save();

      return res.status(201).json({
        message: "Product created successfully",
        data: savedProduct,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error creating product",
        error: error.message,
      });
    }
  },

  getAllProducts: async (req, res) => {
    const { q } = req.query;

    let query = {};
    if (q) {
      query = { name: { $regex: q, $options: "i" } };
    }

    const products = await Product.find(query).populate("category_id");

    res.status(200).json({
      message: "Products fetched successfully",
      data: products.map((product) => {
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          type: product.type,
          image_url: product.image_url,
          category: product.category_id,
        };
      }),
    });
  },

  getProductById: async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category_id");
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: {
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        type: product.type,
        image_url: product.image_url,
        category: product.category_id,
      },
    });
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, type, image_url, category_id } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
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
    if (type) {
      product.type = type;
    }
    if (image_url) {
      product.image_url = image_url;
    }
    if (category_id) {
      product.category_id = category_id;
    }
    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  },
};
