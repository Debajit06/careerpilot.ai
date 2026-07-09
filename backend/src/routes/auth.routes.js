import express from "express";
import authController from "../controller/auth.controller.js";
import authUser from "../middleware/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/register", authController.resgisterUser);

authRoute.post("/login", authController.loginUser);

authRoute.get("/logout", authController.logoutUser);

authRoute.get("/get-me", authUser, authController.getMe);

export default authRoute;
