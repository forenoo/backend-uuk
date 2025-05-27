import Transaction from "../models/transaction.js";
import TransactionDetail from "../models/transactionDetail.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

export const transactionController = {
  createTransaction: async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.array(),
      });
    }

    const { customer_id, total_price, products } = req.body;

    try {
      if (Array.isArray(products) && products.length > 0) {
        for (const item of products) {
          const product = await Product.findById(item.product_id);

          if (!product) {
            return res.status(404).json({
              success: false,
              message: `Product with ID ${item.product_id} not found`,
            });
          }

          if (product.stock < item.quantity) {
            return res.status(400).json({
              success: false,
              message: `Insufficient stock for product ${product.name}`,
            });
          }
        }
      }

      const transaction = await Transaction.create({
        customer_id,
        total_price,
      });

      if (Array.isArray(products) && products.length > 0) {
        const transactionDetails = products.map((product) => ({
          transaction_id: transaction._id,
          product_id: product.product_id,
          quantity: product.quantity,
          subtotal: product.subtotal,
        }));

        await TransactionDetail.insertMany(transactionDetails);

        for (const item of products) {
          await Product.findByIdAndUpdate(item.product_id, {
            $inc: { stock: -item.quantity },
          });
        }
      }

      res.status(201).json({
        success: true,
        message: "Berhasil membuat transaksi",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal membuat transaksi",
        error: error.message,
      });
    }
  },

  getAllTransaction: async (req, res) => {
    try {
      const { q } = req.query;

      const transactions = await Transaction.aggregate([
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: q
            ? { "customer.username": { $regex: q, $options: "i" } }
            : {},
        },
        {
          $unset: ["customer_id"],
        },
        {
          $lookup: {
            from: "transaction_details",
            localField: "_id",
            foreignField: "transaction_id",
            as: "details",
          },
        },
        {
          $addFields: {
            total_items: {
              $sum: "$details.quantity",
            },
          },
        },
        {
          $unset: ["details"],
        },
      ]);

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua transaksi",
        data: transactions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil transaksi",
        error: error.message,
      });
    }
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;

    try {
      const [transaction] = await Transaction.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unset: ["customer_id"],
        },
        {
          $lookup: {
            from: "transaction_details",
            localField: "_id",
            foreignField: "transaction_id",
            as: "details",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "details.product_id",
            foreignField: "_id",
            as: "products",
          },
        },
        {
          $addFields: {
            details: {
              $map: {
                input: "$details",
                as: "detail",
                in: {
                  $mergeObjects: [
                    {
                      _id: "$$detail._id",
                      transaction_id: "$$detail.transaction_id",
                      quantity: "$$detail.quantity",
                      subtotal: "$$detail.subtotal",
                      product: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$products",
                              as: "prod",
                              cond: {
                                $eq: ["$$prod._id", "$$detail.product_id"],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            total_items: {
              $sum: "$details.quantity",
            },
          },
        },
        {
          $unset: ["products"],
        },
      ]);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: "Transaksi tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil transaksi",
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil transaksi",
        error: error.message,
      });
    }
  },

  deleteTransaction: async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaksi berhasil dihapus",
    });
  },

  getUserTransaction: async (req, res) => {
    try {
      const transactions = await Transaction.aggregate([
        {
          $match: { customer_id: new mongoose.Types.ObjectId(req.user.id) },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: {
            path: "$customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unset: ["customer_id"],
        },
        {
          $lookup: {
            from: "transaction_details",
            localField: "_id",
            foreignField: "transaction_id",
            as: "details",
          },
        },
        {
          $addFields: {
            total_items: {
              $sum: "$details.quantity",
            },
          },
        },
        {
          $unset: ["details"],
        },
      ]);

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil transaksi",
        data: transactions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil transaksi",
        error: error.message,
      });
    }
  },
};
