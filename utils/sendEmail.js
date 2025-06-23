const nodemailer = require("nodemailer");

const sendEmail = async ({ to, code, user, type }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let subject, htmlContent;
  if (type === "verify-account") {
    subject = "🔐 Xác Thực Tài Khoản - App Coffee";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #007BFF; text-align: center;">🔐 Xác Thực Tài Khoản</h2>
        <p style="font-size: 16px; color: #333;">Chào <strong>${user}</strong>,</p>
        <p style="font-size: 16px; color: #555;">Cảm ơn bạn đã đăng ký tài khoản tại <strong>App Coffee</strong>. Vui lòng sử dụng mã dưới đây để xác thực tài khoản của bạn:</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; color: #007BFF; padding: 15px; background-color: #fff; border-radius: 5px; border: 2px dashed #007BFF;">
          ${code}
        </div>
        <p style="font-size: 16px; color: #555;">Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 14px; color: #999; text-align: center;">© 2024 App Coffee. All rights reserved.</p>
      </div>
    `;
  } else if (type === "forgot-password") {
    subject = "🔑 Đặt Lại Mật Khẩu - App Coffee";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #FF4500; text-align: center;">🔑 Yêu Cầu Đặt Lại Mật Khẩu</h2>
        <p style="font-size: 16px; color: #333;">Chào <strong>${user}</strong>,</p>
        <p style="font-size: 16px; color: #555;">Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào nút bên dưới để tiếp tục:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.CLIENT_URL}/reset-password?token=${code}" 
             style="background-color: #FF4500; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
            Đặt lại mật khẩu
          </a>
        </div>
        <p style="font-size: 16px; color: #555;">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 14px; color: #999; text-align: center;">© 2024 App Coffee. All rights reserved.</p>
      </div>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
