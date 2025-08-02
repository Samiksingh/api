import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./backend/route/user.route.js";
import database from "./backend/DB/mongodb.js";


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/User", userRoutes);



app.listen(PORT, () => {
    database();
  console.log("app is running");
});



