const ChatMessage = require("../models/ChatMessage");
const chatService = require("../services/chatService");

const createChatRoom = async (req, res) => {
  try {
    const { participants, isGroupChat, name } = req.body;
    let finalParticipants = participants;
    if (!isGroupChat) {
      if (!participants || participants.length !== 1) {
        return res
          .status(400)
          .json({ message: "Phòng chat 1:1 cần đúng 1 userId khác" });
      }
      finalParticipants = [req.user.id, ...participants];
      const existRoom = await chatService.findOneToOneRoom(
        req.user.id,
        participants[0]
      );
      if (existRoom) {
        return res
          .status(200)
          .json({ message: "Phòng chat đã tồn tại", room: existRoom });
      }
    }

    if (!finalParticipants || finalParticipants.length < 2) {
      return res.status(400).json({ message: "Cần ít nhất 2 người tham gia" });
    }

    const chatRoomData = {
      participants: finalParticipants,
      isGroupChat,
      name: isGroupChat ? name : name,
      admin: isGroupChat ? req.user.id : null,
    };

    const chatRoom = await chatService.createChatRoom(chatRoomData);
    res.status(201).json(chatRoom);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi tạo phòng chat", error: error.message });
  }
};
const uploadChatImage = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const senderId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Không có ảnh được upload." });
    }

    // ✅ Lấy list ảnh từ req.files
    const imageUrls = req.files.map((file) => file.path);
    console.log("Ảnh upload:", imageUrls);

    // ✅ Tạo tin nhắn mới
    const newMessage = new ChatMessage({
      chatRoom: roomId,
      sender: senderId,
      message: message || "",
      images: imageUrls, // mảng ảnh
      messageType: "image",
    });

    await newMessage.save();

    res.status(200).json({
      message: "Gửi ảnh thành công",
      data: newMessage,
    });
  } catch (err) {
    console.error("Lỗi upload ảnh chat:", err);
    res.status(500).json({ message: "Lỗi server khi upload ảnh." });
  }
};

// Lấy danh sách phòng chat mà user tham gia
const getChatRooms = async (req, res) => {
  try {
    const rooms = await chatService.getChatRooms(req.user._id);
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy phòng chat", error: error.message });
  }
};

// Gửi tin nhắn trong phòng chat
const sendMessage = async (req, res) => {
  try {
    const { roomId, message, messageType } = req.body;
    // console.log(roomId, message, messageType);

    const messageData = {
      chatRoom: roomId,
      sender: req.user.id,
      message,
      messageType: messageType || "text",
    };
    const chatMessage = await chatService.sendMessage(messageData);
    // io.to(messageData.chatRoom).emit("receiveMessage", chatMessage);
    res.status(201).json(chatMessage);
  } catch (error) {
    // const phongdaucac = console.log("ngu như bò");
    res.status(500).json({ message: "Lỗi gửi tin nhắn", error: error.message });
  }
};

// Lấy danh sách tin nhắn theo phòng chat
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await chatService.getMessages(roomId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy tin nhắn", error: error.message });
  }
};
module.exports = {
  createChatRoom,
  getChatRooms,
  sendMessage,
  getMessages,
  uploadChatImage,
};
