const {
  registerUser,
  verifyUserByEmail,
  resendVerificationCodeService,
  resetPwd,
  generateToken,
  forgotPasswordV1,
} = require("../services/authService");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Crypto = require("crypto");
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

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Tài khoản không tồn tại" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Tài khoản chưa xác thực!" });
    }

    const comPass = await bcrypt.compare(password, user.password);
    if (!comPass)
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });

    user.isActive = true;
    await user.save();

    const token = await generateToken(user);
    setCookie(res, token);

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
    res.status(500).json({ message: "Lỗi server", error: error.message });
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
    const response = await forgotPasswordV1(email);
    res
      .status(200)
      .json({ message: "Email đặt lại mật khẩu đã được gửi!", response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const confirmResetRequest = async (req, res) => {
  try {
    const { token } = req.query;
    console.log(token);
    const hashedToken = Crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+isResetPasswordRequested");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }

    if (!user.isResetPasswordRequested) {
      return res
        .status(400)
        .json({ message: "Yêu cầu đặt lại đã được xác nhận." });
    }

    user.isResetPasswordRequested = false;
    await user.save();

    // Redirect về frontend để user nhập mật khẩu mới
    res.redirect(
      `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${user.email}`
    );
  } catch (error) {
    res.status(500).json({
      message: "Lỗi xác nhận đặt lại mật khẩu",
      error: error.message,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const response = await resetPwd(token, newPassword); // gọi service
    res.status(200).json(response);
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
  confirmResetRequest,
};
