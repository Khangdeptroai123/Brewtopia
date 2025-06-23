const axios = require("axios");

module.exports = (socket, io) => {
  socket.on("sendAIMessage", async ({ userId, message }) => {
    console.log(`🔍 AI Processing message: "${message}" from user ${userId}`);

    try {
      // Gọi API OpenAI (hoặc LLM khác) để lấy phản hồi từ AI
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      console.log(`🤖 AI Response: ${aiResponse}`);

      // Gửi phản hồi về client
      socket.emit("receiveAIMessage", { userId, aiResponse });
    } catch (error) {
      console.error("❌ AI Chat Error:", error);
      socket.emit("receiveAIMessage", {
        userId,
        aiResponse: "Xin lỗi, tôi không thể phản hồi ngay bây giờ.",
      });
    }
  });
};
