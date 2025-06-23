const OrderMeetingRoomService = require("../services/Orders/MeetingRoomService");

const createOrderMeetingRoom = async (req, res) => {
  try {
    const { room, startTime, endTime, amount } = req.body;
    const userId = req.user.id;
    if (!room || !startTime || !endTime || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await OrderMeetingRoomService.createOrderMeetingRoom({
      userId,
      room,
      startTime,
      endTime,
      amount,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create OrderMeetingRoom error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getOrderMeetingRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await OrderMeetingRoomService.getOrderMeetingRooms(userId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get OrderMeetingRooms error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrderMeetingRoom,
  getOrderMeetingRooms,
};
