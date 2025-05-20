import Joi from "joi";
import Category from "../models/category.js";
import Product from "../models/product.js";

export const categoryController = {
  createCategory: async (req, res) => {
    const validation = Joi.object({
      icon: Joi.string().required(),
      name: Joi.string().required(),
      status: Joi.string().valid("active", "inactive").required(),
    });

    const { error } = validation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const { icon, name, status } = req.body;

    const newCategory = new Category({
      icon,
      name,
      status,
    });
    await newCategory.save();

    res.status(201).json({
      message: "Berhasil membuat kategori",
      data: newCategory,
    });
  },

  getAllCategories: async (req, res) => {
    const categories = await Category.find();

    const categoriesWithProductCount = await Promise.all(
      categories.map(async (category) => {
        const total_product = await Product.countDocuments({
          category_id: category._id,
        });
        return {
          ...category.toObject(),
          total_product,
        };
      })
    );

    res.status(200).json({
      message: "Berhasil mendapatkan semua kategori",
      data: categoriesWithProductCount,
    });
  },

  getCategoryById: async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    const total_product = await Product.countDocuments({
      category_id: category._id,
    });

    res.status(200).json({
      message: "Berhasil mendapatkan kategori",
      data: {
        ...category.toObject(),
        total_product,
      },
    });
  },

  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { icon, name, status } = req.body;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    if (icon) {
      category.icon = icon;
    }
    if (name) {
      category.name = name;
    }
    if (status) {
      category.status = status;
    }

    await category.save();

    res.status(200).json({
      message: "Berhasil mengupdate kategori",
      data: category,
    });
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    await Product.deleteMany({ category_id: category._id });

    res.status(200).json({
      message: "Berhasil menghapus kategori",
    });
  },
};
