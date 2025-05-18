import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transaction_date: {
    type: Date,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
});

const Transaction = mongoose.model("transaction", transactionSchema);

export default Transaction;
