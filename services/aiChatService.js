const axios = require("axios");

// Gọi API ChatGPT để chat với AI
const chatWithAI = async (message) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: message,
        max_tokens: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const aiReply = response.data.choices[0].text;
    return aiReply;
  } catch (error) {
    throw new Error("Lỗi khi gọi ChatGPT API: " + error.message);
  }
};

module.exports = chatWithAI;
