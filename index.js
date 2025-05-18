import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import transactionRoutes from "./routes/transactionRoute.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import cors from "cors";

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", authMiddleware, productRoutes);
app.use("/api", authMiddleware, transactionRoutes);

app.use(notFoundMiddleware);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

export default app;
