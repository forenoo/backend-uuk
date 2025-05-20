import Transaction from "../models/transaction.js";
import TransactionDetail from "../models/transactionDetail.js";
import mongoose from "mongoose";

export const transactionController = {
  createTransaction: async (req, res) => {
    try {
      const { customer_id, total_price, products } = req.body;

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
      }

      res.status(201).json({
        success: true,
        data: transaction,
        message: "Berhasil membuat transaksi",
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
          $addFields: {
            total_items: {
              $sum: "$details.quantity",
            },
          },
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

  updateTransaction: async (req, res) => {},

  deleteTransaction: async (req, res) => {},
};
