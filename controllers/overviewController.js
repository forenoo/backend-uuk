import Customer from "../models/customer.js";
import Product from "../models/product.js";
import Transaction from "../models/transaction.js";

export const overviewController = {
  getOverview: async (req, res) => {
    const totalCustomer = await Customer.countDocuments();
    const totalProduct = await Product.countDocuments();
    const totalTransaction = await Transaction.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_price" },
          totalTransaction: { $sum: 1 },
        },
      },
    ]);

    const revenueData = totalRevenue[0] || { totalRevenue: 0 };

    res.status(200).json({
      message: "Berhasil mengambil data overview",
      data: {
        totalCustomer,
        totalProduct,
        totalTransaction,
        totalRevenue: revenueData.totalRevenue,
      },
    });
  },

  getRecentTransactions: async (req, res) => {
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
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      message: "Berhasil mengambil data transaksi terbaru",
      data: transactions,
    });
  },

  getRecentProducts: async (req, res) => {
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      message: "Berhasil mengambil data produk terbaru",
      data: recentProducts,
    });
  },
};
