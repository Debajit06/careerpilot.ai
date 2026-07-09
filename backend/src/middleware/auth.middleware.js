import jwt from "jsonwebtoken";
import blacklistModel from "../models/blacklistToken.js";

async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "token is not present",
      });
    }

    const istokenBlacklist = await blacklistModel.findOne({ token });

    if (istokenBlacklist) {
      return res.status(400).json({
        message: "token is blacklisted",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "internal server error",
    });
  }
}
export default authUser;
