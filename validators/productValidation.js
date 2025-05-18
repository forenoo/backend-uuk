import { body } from "express-validator";

export const createProductValidation = [
  body("name").notEmpty().withMessage("Nama produk tidak boleh kosong"),
  body("price").notEmpty().withMessage("Harga produk tidak boleh kosong").isNumeric().withMessage("Harga produk harus berupa angka"),
  body("stock").notEmpty().withMessage("Stok produk tidak boleh kosong").isNumeric().withMessage("Stok produk harus berupa angka"),
];
