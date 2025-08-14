import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import applicationRoutes from "./routes/applicationRoutes";
import userRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (_, res) => {
  res.send("Job Tracker API is running");
});

app.use("/api/applications", applicationRoutes);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
