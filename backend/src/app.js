import express from "express";
import cookie from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";

const app = express();

app.use(express.json());
app.use(cookie());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/interview", interviewRouter);

export default app;
