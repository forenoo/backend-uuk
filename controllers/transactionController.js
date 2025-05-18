import Transaction from "../models/transaction.js";
import TransactionDetail from "../models/transactionDetail.js";
import Customer from "../models/customer.js";
import Product from "../models/product.js";

export const transactionController = {
  createTransaction: async (req, res) => {
    const { customer_name, address, phone_number, products } = req.body;

    let customer = await Customer.findOne({ name: customer_name });
    if (!customer) {
      customer = await Customer.create({
        name: customer_name,
        address: address || "",
        phone_number: phone_number || "",
      });
    }

    let total_amount = 0;
    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({
          status: "error",
          message: `Produk dengan ID ${item.product_id} tidak ditemukan`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: "error",
          message: `Stok produk ${product.name} tidak cukup`,
        });
      }

      total_amount += product.price * item.quantity;
    }

    const transaction = await Transaction.create({
      customer_id: customer._id,
      total_amount: total_amount,
      transaction_date: new Date(),
    });
    await transaction.save();

    const transactionId = transaction._id;

    const transactionDetails = [];
    for (const item of products) {
      const product = await Product.findById(item.product_id);
      const subtotal = product.price * item.quantity;

      const detail = await TransactionDetail.create({
        transaction_id: transactionId,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: subtotal,
      });

      transactionDetails.push(detail);

      product.stock -= item.quantity;
      await product.save();
    }

    return res.status(201).json({
      status: "success",
      message: "Transaksi berhasil dibuat",
      data: {
        transaction: transaction,
        details: transactionDetails,
      },
    });
  },

  getTransactions: async (req, res) => {
    const transactions = await Transaction.find().populate("customer_id");

    return res.status(200).json({
      status: "success",
      message: "Transaksi berhasil diambil",
      data: transactions,
    });
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findById(id).populate("customer_id");
    if (!transaction) {
      return res.status(404).json({
        status: "error",
        message: "Transaksi tidak ditemukan",
      });
    }

    const details = await TransactionDetail.find({
      transaction_id: id,
    }).populate("product_id");

    const transactionData = transaction.toObject();
    transactionData.details = details;

    return res.status(200).json({
      status: "success",
      message: "Transaksi berhasil diambil",
      data: transactionData,
    });
  },
};
