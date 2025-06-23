const Event = require("../models/Event");

const creEvent = async (eventData) => {
  // Kiểm tra dữ liệu đầu vào
  if (!eventData.title || !eventData.description || !eventData.image) {
    throw new Error("Thiếu các trường bắt buộc: title, description and image");
  }

  // Tạo object sự kiện mới

  const event = await Event.create({
    ...eventData,
    cafe: eventData.cafeId,
    followers: [],
  });

  return event;
};

const getEventAll = async () => {
  try {
    const events = await Event.find();
    return events;
  } catch (error) {
    throw new Error("Không thể lấy danh sách sự kiện");
  }
};
const followEvent = async (eventId, userId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Sự kiện không tồn tại");

    // Kiểm tra xem người dùng đã quan tâm chưa
    if (event.followers.includes(userId)) {
      throw new Error("Người dùng đã quan tâm sự kiện này");
    }

    // Thêm userId vào mảng followers
    event.followers.push(userId);
    await event.save();
    return event;
  } catch (error) {
    throw new Error(error.message || "Không thể quan tâm sự kiện");
  }
};

const unfollowEvent = async (eventId, userId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Sự kiện không tồn tại");

    // Kiểm tra xem người dùng có trong danh sách followers không
    if (!event.followers.includes(userId)) {
      throw new Error("Người dùng chưa quan tâm sự kiện này");
    }

    // Xóa userId khỏi mảng followers
    event.followers = event.followers.filter(
      (id) => id.toString() !== userId.toString()
    );
    await event.save();
    return event;
  } catch (error) {
    throw new Error(error.message || "Không thể bỏ quan tâm sự kiện");
  }
};
const getEvent = async (id) => {
  try {
    console.log(id);

    const event = await Cafes.find(id);
    if (!event) throw new Error("Sự kiện không tồn tại");
    return event;
  } catch (error) {
    throw new Error("Không thể lấy thông tin sự kiện");
  }
};

const upEvent = async (id, eventData) => {
  try {
    const event = await Event.findByIdAndUpdate(id, eventData, { new: true });
    if (!event) throw new Error("Sự kiện không tồn tại");
    return event;
  } catch (error) {
    throw new Error("Không thể cập nhật sự kiện");
  }
};

const delEvent = async (id) => {
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new Error("Sự kiện không tồn tại");
    return { message: "Xóa sự kiện thành công", eventId: id };
  } catch (error) {
    throw new Error("Không thể xóa sự kiện");
  }
};
const toggleFollowEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Sự kiện không tồn tại");
  const isFollowing = event.followers.includes(userId);
  if (isFollowing) {
    event.followers = event.followers.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    event.followers.push(userId);
  }
  // Cập nhật lại trường Countfollower
  event.Countfollower = event.followers.length;
  await event.save();
  return event;
};

module.exports = {
  toggleFollowEvent,
  creEvent,
  getEventAll,
  getEvent,
  upEvent,
  delEvent,
  followEvent,
  unfollowEvent,
};
