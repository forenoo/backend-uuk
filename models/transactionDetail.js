import mongoose from "mongoose";

const transactionDetailSchema = new mongoose.Schema({
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
  },
  subtotal: {
    type: Number,
  },
});

const TransactionDetail = mongoose.model(
  "transaction_detail",
  transactionDetailSchema
);

export default TransactionDetail;
