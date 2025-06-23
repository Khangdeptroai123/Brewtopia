const OrderMeetingRoom = require("../../models/Order/MeetingRoom");
const User = require("../../models/User");

const createOrderMeetingRoom = async ({
  userId,
  room,
  startTime,
  endTime,
  amount,
}) => {
  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate input
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Amount must be a positive integer");
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start) || isNaN(end) || start >= end) {
      throw new Error("Invalid startTime or endTime");
    }

    // Create order
    const order = new OrderMeetingRoom({
      user: userId,
      room,
      startTime: start,
      endTime: end,
      amount,
      status: "pending",
    });

    await order.save();
    return {
      id: order._id,
      room,
      startTime,
      endTime,
      amount,
      status: order.status,
    };
  } catch (error) {
    console.error(`Create OrderMeetingRoom error: ${error.message}`);
    throw error;
  }
};

const getOrderMeetingRooms = async (userId) => {
  try {
    const orders = await OrderMeetingRoom.find({ user: userId }).select(
      "_id room startTime endTime amount status"
    );
    return orders;
  } catch (error) {
    console.error(`Get OrderMeetingRooms error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createOrderMeetingRoom,
  getOrderMeetingRooms,
};
