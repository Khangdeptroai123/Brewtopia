const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cafeService = require("../services/cafeService");
const e = require("express");
const { log } = require("console");

// Hàm gửi email xác thực
const sendVerificationEmail = async (user) => {
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Cập nhật mã xác thực và thời gian hết hạn
  user.verificationCode = verificationCode;
  user.verificationExpiresAt = Date.now() + 10 * 60 * 1000; // 10 phút
  await user.save();

  // Gửi email xác thực (dùng chung `sendEmail`)
  await sendEmail({
    to: user.email,
    code: verificationCode,
    user: user.name,
    type: "verify-account", // Định danh loại email
  });
};

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email đã tồn tại!");
  if (!password) throw new Error("Mật khẩu không được để trống!");
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
    role: role || "user",
  });

  if (role === "admin") {
    const cafeData = {
      owner: user._id,
    };
    await cafeService.createCafe(cafeData);
  }
  await sendVerificationEmail(user);
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Tài khoản không tồn tại!");
  const comPass = await bcrypt.compare(password, user.password);
  if (!comPass) throw new Error("Mật khẩu không chính xác!");
  if (!user.isVerified) throw new Error("Tài khoản chưa xác thực!");
  user.isActive = true;
  await user.save();
  return user;
};

// Service xác thực OTP
const verifyUserByEmail = async (email, code) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Tài khoản không tồn tại!");
  if (user.isVerified) throw new Error("Tài khoản đã được xác thực!");
  if (user.verificationCode !== code)
    throw new Error("Mã xác thực không đúng!");
  if (user.verificationExpiresAt < new Date())
    throw new Error("Mã xác thực đã hết hạn!");

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationExpiresAt = null;
  await user.save();

  return user;
};

const generateToken = async (user) => {
  return jwt.sign(
    { email: user.email, id: user.id, role: user.role || "user" },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};
// Service gửi lại mã xác thực
const resendVerificationCodeService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User không tồn tại");

  if (user.isVerified) throw new Error("Tài khoản đã được xác thực");

  return sendVerificationEmail(user);
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại!");

  // Tạo token đặt lại mật khẩu (random string)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Mã hóa token trước khi lưu vào database
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Lưu token vào user và đặt thời gian hết hạn (15 phút)
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000; // 15 phút
  await user.save();

  // Gửi email reset password
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;
  await sendEmail(
    user.email,
    `Bấm vào link để đặt lại mật khẩu: ${resetLink}`,
    user.name
  );

  return { message: "Đã gửi email đặt lại mật khẩu!", resetLink };
};

// ✅ Đặt lại mật khẩu
const resetPwd = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token không hợp lệ hoặc đã hết hạn!");
  // ✅ Mã hóa mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  // ✅ Xóa token sau khi đặt lại mật khẩu
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: "Mật khẩu đã được đặt lại thành công!" };
};

const sendResetPasswordEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại!");

  // Tạo token ngẫu nhiên
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Lưu token vào database với hạn sử dụng
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
  await user.save();

  // Gửi email chứa link reset mật khẩu
  await sendEmail({
    to: email,
    code: resetToken, // Truyền token vào hàm sendEmail
    user: user.name,
    type: "forgot-password", // Dùng chung hàm gửi email
  });

  return { email };
};

module.exports = {
  registerUser,
  loginUser,
  sendVerificationEmail,
  verifyUserByEmail,
  resendVerificationCodeService,
  generateToken,
  forgotPassword,
  resetPwd,
  sendResetPasswordEmail,
};
