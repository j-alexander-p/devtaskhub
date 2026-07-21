import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import errorHandler from "./middleware/errorHandler";
import authMiddleware from "./middleware/authMiddleware";
import { Request, Response } from "express";
import projectRoutes from "./routes/projects";
import userRoutes from "./routes/users";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

//Dependecy Middleware
app.use(express.json());
app.use(cookieParser());

//Routes here
app.use("/auth", authRoutes);
app.use("/projects", authMiddleware, projectRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/tasks", authMiddleware, taskRoutes);

// Error handling here
app.use(errorHandler);

export default app;
