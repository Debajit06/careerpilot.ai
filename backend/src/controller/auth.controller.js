import userModel from "../models/user.model.js";
import blacklistTokenModel from "../models/blacklistToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function resgisterUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "provide username,email,password",
      });
    }
    const isuserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isuserExist) {
      return res.status(400).json({
        message: "user already exist",
      });
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });
    return res.status(201).json({
      message: "user created successfully",
      User: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "provide email and password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const ispasswordExist = await bcrypt.compare(password, user.password);
    if (!ispasswordExist) {
      return res.status(400).json({
        message: "password not match",
      });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });
    return res.status(201).json({
      message: "user logged in successfully",
      User: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function logoutUser(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      await blacklistTokenModel.create({ token });
    }
    res.clearCookie("token");
    return res.status(200).json({
      message: "user logged out successfully",
    });
  } catch (error) {}
}

async function getMe(req, res) {
  const User = await userModel.findById(req.user.id);
  return res.status(200).json({
    message: "user data ",
    User: {
      username: User.username,
      email: User.email,
    },
  });
}
export default { resgisterUser, loginUser, logoutUser, getMe };
