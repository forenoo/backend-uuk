import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  phone_number: {
    type: String,
    required: false,
  },
});

const Customer = mongoose.model("customer", customerSchema);

export default Customer;
