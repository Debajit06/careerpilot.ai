import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/file.middleware.js";
import interviewController from "../controller/interview.controller.js";

const interviewRoute = express.Router();

interviewRoute.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  interviewController.generateInterViewReportController,
);

interviewRoute.get(
  "/report/:interviewId",
  authMiddleware,
  interviewController.getInterviewReportByIdController,
);

interviewRoute.get(
  "/",
  authMiddleware,
  interviewController.getAllInterviewReportsController,
);

interviewRoute.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware,
  interviewController.generateResumePdfController,
);

export default interviewRoute;
