import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.js";
import Product from "../models/product.js";
import Customer from "../models/customer.js";
import Transaction from "../models/transaction.js";
import TransactionDetail from "../models/transactionDetail.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// Load environment variables
dotenv.config();

// Connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Array to store created data for reference
const createdData = {
  categories: [],
  products: [],
  customers: [],
  transactions: [],
  transactionDetails: [],
};

// Function to create categories
const createCategories = async () => {
  console.log("Creating categories...");

  const categories = [
    { icon: "🍔", name: "Burgers" },
    { icon: "🍕", name: "Pizza" },
    { icon: "🍝", name: "Pasta" },
    { icon: "🥗", name: "Salads" },
    { icon: "🍦", name: "Desserts" },
    { icon: "☕", name: "Coffee" },
    { icon: "🍵", name: "Tea" },
    { icon: "🥤", name: "Soft Drinks" },
    { icon: "🍹", name: "Cocktails" },
    { icon: "🍿", name: "Snacks" },
  ];

  try {
    // Clear existing categories
    await Category.deleteMany({});

    // Create new categories
    for (const category of categories) {
      const newCategory = await Category.create({
        icon: category.icon,
        name: category.name,
        status: "active",
      });

      createdData.categories.push(newCategory);
    }

    console.log(`Created ${createdData.categories.length} categories`);
  } catch (error) {
    console.error("Error creating categories:", error);
  }
};

// Function to create products
const createProducts = async () => {
  console.log("Creating products...");

  const productTypes = ["food", "drink", "snack"];
  const imageUrl =
    "/uploads/1747806439651-_2cad0f15-a6fc-4b46-8f5c-c66291ed6aa2.jpeg";

  try {
    // Clear existing products
    await Product.deleteMany({});

    // Create 50 products
    for (let i = 0; i < 50; i++) {
      // Select random category from created categories
      const randomCategory = faker.helpers.arrayElement(createdData.categories);

      const product = await Product.create({
        name: faker.commerce.productName(),
        price: faker.number.int({ min: 10000, max: 100000 }),
        stock: faker.number.int({ min: 10, max: 100 }),
        type: faker.helpers.arrayElement(productTypes),
        image_url: imageUrl,
        category_id: randomCategory._id,
      });

      createdData.products.push(product);
    }

    console.log(`Created ${createdData.products.length} products`);
  } catch (error) {
    console.error("Error creating products:", error);
  }
};

// Function to create customers
const createCustomers = async () => {
  console.log("Creating customers...");

  try {
    // Clear existing customers
    await Customer.deleteMany({});

    // Create 20 customers
    for (let i = 0; i < 20; i++) {
      const hashedPassword = await bcrypt.hash("password123", 10);

      const customer = await Customer.create({
        username: faker.internet.userName(),
        password: hashedPassword,
        address: faker.location.streetAddress(),
        phone_number: faker.phone.number(),
      });

      createdData.customers.push(customer);
    }

    console.log(`Created ${createdData.customers.length} customers`);
  } catch (error) {
    console.error("Error creating customers:", error);
  }
};

// Function to create transactions
const createTransactions = async () => {
  console.log("Creating transactions...");

  try {
    // Clear existing transactions
    await Transaction.deleteMany({});

    // Create 100 transactions
    for (let i = 0; i < 100; i++) {
      const randomCustomer = faker.helpers.arrayElement(createdData.customers);

      const transaction = await Transaction.create({
        customer_id: randomCustomer._id,
        total_price: 0, // We'll update this after creating transaction details
      });

      createdData.transactions.push(transaction);
    }

    console.log(`Created ${createdData.transactions.length} transactions`);
  } catch (error) {
    console.error("Error creating transactions:", error);
  }
};

// Function to create transaction details
const createTransactionDetails = async () => {
  console.log("Creating transaction details...");

  try {
    // Clear existing transaction details
    await TransactionDetail.deleteMany({});

    // Create approximately 200 transaction details
    for (const transaction of createdData.transactions) {
      // Each transaction will have 1-5 items
      const numberOfItems = faker.number.int({ min: 1, max: 5 });
      let totalPrice = 0;

      for (let i = 0; i < numberOfItems; i++) {
        const randomProduct = faker.helpers.arrayElement(createdData.products);
        const quantity = faker.number.int({ min: 1, max: 5 });
        const subtotal = randomProduct.price * quantity;

        totalPrice += subtotal;

        const transactionDetail = await TransactionDetail.create({
          transaction_id: transaction._id,
          product_id: randomProduct._id,
          quantity: quantity,
          subtotal: subtotal,
        });

        createdData.transactionDetails.push(transactionDetail);
      }

      // Update the transaction with the total price
      await Transaction.findByIdAndUpdate(transaction._id, {
        total_price: totalPrice,
      });
    }

    console.log(
      `Created ${createdData.transactionDetails.length} transaction details`
    );
  } catch (error) {
    console.error("Error creating transaction details:", error);
  }
};

// Main function to run the seeding process
const seedDatabase = async () => {
  try {
    await createCategories();
    await createProducts();
    await createCustomers();
    await createTransactions();
    await createTransactionDetails();

    console.log("Database seeding completed successfully!");

    // Print summary
    console.log("\nSummary:");
    console.log(`Categories: ${createdData.categories.length}`);
    console.log(`Products: ${createdData.products.length}`);
    console.log(`Customers: ${createdData.customers.length}`);
    console.log(`Transactions: ${createdData.transactions.length}`);
    console.log(
      `Transaction Details: ${createdData.transactionDetails.length}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
