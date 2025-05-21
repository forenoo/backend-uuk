import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
};

const createUsers = async () => {
  try {
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash("admin123", saltRounds);
    const employeePassword = await bcrypt.hash("employee123", saltRounds);

    const users = [
      {
        username: "admin",
        password: adminPassword,
        role: "admin",
      },
      {
        username: "employee1",
        password: employeePassword,
        role: "employee",
      },
      {
        username: "employee2",
        password: employeePassword,
        role: "employee",
      },
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ username: userData.username });

      if (existingUser) {
        console.log(`User ${userData.username} already exists`);
      } else {
        const newUser = await User.create(userData);
        console.log(`Created ${userData.role}: ${userData.username}`);
      }
    }

    console.log("User creation process completed");
  } catch (error) {
    console.error("Error creating users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

const run = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    await createUsers();
    process.exit(0);
  } else {
    console.error("Failed to connect to the database");
    process.exit(1);
  }
};

run();
