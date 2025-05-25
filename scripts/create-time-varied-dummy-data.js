import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.js";
import Product from "../models/product.js";
import Customer from "../models/customer.js";
import Transaction from "../models/transaction.js";
import TransactionDetail from "../models/transactionDetail.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

const createdData = {
  categories: [],
  products: [],
  customers: [],
  transactions: [],
  transactionDetails: [],
};

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

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
    await Category.deleteMany({});

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

const createProducts = async () => {
  console.log("Creating products...");

  const productTypes = ["food", "drink", "snack"];
  const imageUrl =
    "/uploads/1747806439651-_2cad0f15-a6fc-4b46-8f5c-c66291ed6aa2.jpeg";

  try {
    await Product.deleteMany({});

    const startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
    const endDate = new Date();

    for (let i = 0; i < 50; i++) {
      const randomCategory = faker.helpers.arrayElement(createdData.categories);
      const createdAt = randomDate(startDate, endDate);

      const product = await Product.create({
        name: faker.commerce.productName(),
        price: faker.number.int({ min: 10000, max: 100000 }),
        stock: faker.number.int({ min: 10, max: 100 }),
        type: faker.helpers.arrayElement(productTypes),
        image_url: imageUrl,
        category_id: randomCategory._id,
        createdAt: createdAt,
        updatedAt: createdAt,
      });

      createdData.products.push(product);
    }

    console.log(`Created ${createdData.products.length} products`);
  } catch (error) {
    console.error("Error creating products:", error);
  }
};

const createCustomers = async () => {
  console.log("Creating customers...");

  try {
    await Customer.deleteMany({});

    const startDate = new Date(new Date().setMonth(new Date().getMonth() - 12));
    const endDate = new Date();

    for (let i = 0; i < 50; i++) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const createdAt = randomDate(startDate, endDate);

      const customer = await Customer.create({
        username: faker.internet.username(),
        password: hashedPassword,
        address: faker.location.streetAddress(),
        phone_number: faker.phone.number(),
        createdAt: createdAt,
        updatedAt: createdAt,
      });

      createdData.customers.push(customer);
    }

    console.log(`Created ${createdData.customers.length} customers`);
  } catch (error) {
    console.error("Error creating customers:", error);
  }
};

const createTransactions = async () => {
  console.log("Creating transactions...");

  try {
    await Transaction.deleteMany({});

    const startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
    const endDate = new Date();

    for (let i = 0; i < 200; i++) {
      const randomCustomer = faker.helpers.arrayElement(createdData.customers);
      const createdAt = randomDate(
        new Date(Math.max(startDate, randomCustomer.createdAt)), // Transaction date must be after customer registration
        endDate
      );

      const transaction = await Transaction.create({
        customer_id: randomCustomer._id,
        total_price: 0,
        createdAt: createdAt,
        updatedAt: createdAt,
      });

      createdData.transactions.push(transaction);
    }

    console.log(`Created ${createdData.transactions.length} transactions`);
  } catch (error) {
    console.error("Error creating transactions:", error);
  }
};

const createTransactionDetails = async () => {
  console.log("Creating transaction details...");

  try {
    await TransactionDetail.deleteMany({});

    for (const transaction of createdData.transactions) {
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
          createdAt: transaction.createdAt,
          updatedAt: transaction.createdAt,
        });

        createdData.transactionDetails.push(transactionDetail);
      }

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

const seedDatabase = async () => {
  try {
    await createCategories();
    await createProducts();
    await createCustomers();
    await createTransactions();
    await createTransactionDetails();

    console.log("Database seeding completed successfully!");

    console.log("\nSummary:");
    console.log(`Categories: ${createdData.categories.length}`);
    console.log(`Products: ${createdData.products.length}`);
    console.log(`Customers: ${createdData.customers.length}`);
    console.log(`Transactions: ${createdData.transactions.length}`);
    console.log(
      `Transaction Details: ${createdData.transactionDetails.length}`
    );

    const customerDates = createdData.customers.map((c) => c.createdAt);
    const transactionDates = createdData.transactions.map((t) => t.createdAt);

    console.log("\nDate Ranges:");
    console.log("Customers:", {
      earliest: new Date(Math.min(...customerDates)).toLocaleDateString(),
      latest: new Date(Math.max(...customerDates)).toLocaleDateString(),
    });
    console.log("Transactions:", {
      earliest: new Date(Math.min(...transactionDates)).toLocaleDateString(),
      latest: new Date(Math.max(...transactionDates)).toLocaleDateString(),
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
