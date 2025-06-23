const {
  registerUser,
  loginUser,
  verifyUserByEmail,
  resendVerificationCodeService,
  resetPwd,
  generateToken,
} = require("../services/authService");
const User = require("../models/User");
const setCookie = require("../utils/setCookie");
const Cafe = require("../models/Cafe");
const { token } = require("morgan");
// Đăng ký tài khoản
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin!" });
    }

    // Gọi service để đăng ký user
    const user = await registerUser({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    if (!user) return res.status(401).json({ message: "User not found" });
    const token = await generateToken(user);
    setCookie(res, token);
    // Kiểm tra nếu user là admin
    if (user.role === "admin") {
      const cafe = await Cafe.findOne({ owner: user._id });
      if (cafe && cafe.status === "pending") {
        return res.status(200).json({
          token,
          user,
          message: "Vui lòng cập nhật profile quán cafe của bạn!",
          cafeId: cafe._id,
        });
      }
    }
    res.status(200).json({
      message: "Đăng nhập thành công",
      status: "success",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await verifyUserByEmail(email, code);
    res.status(200).json({
      message: "Tài khoản đã được xác thực thành công!",
      user: {
        _id: user._id,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    await resendVerificationCodeService(email);
    res.status(200).json({ message: "Mã xác thực mới đã được gửi" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Đặt lại mật khẩu bằng token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const response = await resetPwd(token, newPassword);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const user = req.user;
    user.isActive = true;
    const token = await generateToken(user);
    await user.save();
    setCookie(res, token);
    res.status(200).json({ status: "success", token: token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const facebookLogin = async (req, res) => {
  try {
    const user = req.user;
    user.isActive = true;
    // Tạo token
    const token = await generateToken(user);
    console.log(token);
    await user.save();
    setCookie(res, token); // Đặt cookie
    res.status(200).json({ status: "success", token: token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Vui lòng nhập email!" });
    }

    // Gọi service để tạo token và gửi email
    const response = await sendResetPasswordEmail(email);
    res
      .status(200)
      .json({ message: "Email đặt lại mật khẩu đã được gửi!", response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  verifyUser,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
};
