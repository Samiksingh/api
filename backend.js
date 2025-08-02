import express from "express";
import dotenv from "dotenv";
import userRoutes from "./backend/route/user.route.js";
import authRoutes from "./backend/route/auth.route.js";
import blogRoutes from "./backend/route/blog.route.js";
import database from "./backend/DB/mongodb.js";


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body) {
    console.log('Body:', req.body);
  }
  next();
});

// Test route to verify server is working
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

const apiPrefix = "/api/v1";

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/user`, userRoutes);
app.use(`${apiPrefix}/blog`, blogRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    database();
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});



