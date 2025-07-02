const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cafeService = require("../services/cafeService");

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

const forgotPasswordV1 = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại!");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  user.isResetPasswordRequested = true; // 🟡 Đặt trạng thái chờ xác nhận
  await user.save();

  const confirmLink = `${process.env.CLIENT_URL}/confirm-reset?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    code: resetToken,
    user: user.name,
    type: "forgot-password", // bạn tạo template có nút dùng link này
  });

  return { message: "Đã gửi email xác nhận đặt lại mật khẩu", confirmLink };
};
const resetPwd = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+isResetPasswordRequested");

  if (!user) throw new Error("Token không hợp lệ hoặc đã hết hạn!");
  if (user.isResetPasswordRequested)
    throw new Error(
      "Bạn cần bấm vào nút trong email trước khi đặt lại mật khẩu."
    );

  user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.isResetPasswordRequested = undefined; // ✅ xoá field
  await user.save();

  return { message: "Mật khẩu đã được đặt lại thành công!" };
};

module.exports = {
  registerUser,
  sendVerificationEmail,
  verifyUserByEmail,
  resendVerificationCodeService,
  generateToken,
  forgotPasswordV1,
  resetPwd,
};
