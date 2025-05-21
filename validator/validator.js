import { body } from "express-validator";

export const registerValidator = [
  body("username").notEmpty().withMessage("Username tidak boleh kosong"),
  body("password").notEmpty().withMessage("Password tidak boleh kosong"),
  body("address").optional(),
  body("phone_number").optional(),
];

export const loginValidator = [
  body("username").notEmpty().withMessage("Username tidak boleh kosong"),
  body("password").notEmpty().withMessage("Password tidak boleh kosong"),
];

export const createCategoryValidator = [
  body("icon").notEmpty().withMessage("Icon tidak boleh kosong"),
  body("name").notEmpty().withMessage("Nama kategori tidak boleh kosong"),
];

export const createProductValidator = [
  body("name").notEmpty().withMessage("Nama produk tidak boleh kosong"),
  body("price").notEmpty().withMessage("Harga produk tidak boleh kosong"),
  body("stock").notEmpty().withMessage("Stok produk tidak boleh kosong"),
  body("type").notEmpty().withMessage("Tipe produk tidak boleh kosong"),
  body("image_url").notEmpty().withMessage("Gambar produk tidak boleh kosong"),
  body("category_id")
    .notEmpty()
    .withMessage("Kategori produk tidak boleh kosong"),
];

export const createTransactionValidator = [
  body("customer_id").notEmpty().withMessage("Customer tidak boleh kosong"),
  body("total_price").notEmpty().withMessage("Total harga tidak boleh kosong"),
  body("products").notEmpty().withMessage("Produk tidak boleh kosong"),
];
