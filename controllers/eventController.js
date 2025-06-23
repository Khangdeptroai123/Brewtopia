const {
  upEvent,
  creEvent,
  delEvent,
  getEventAll,
  getEvent,
  followEvent,
  unfollowEvent,
  toggleFollowEvent,
} = require("../services/eventService");

const createEvent = async (req, res) => {
  try {
    const cafeId = req.params.id;
    const data = { ...req.body, cafeId };

    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      data.image = imageFile.path;
    }
    const event = await creEvent(data);
    console.log("đã thêm sự kiện thành công");
    res.status(201).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo sự kiện", error: error.message });
  }
};
const followEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;
    const event = await followEvent(eventId, userId);
    res.status(200).json({ message: "Quan tâm sự kiện thành công", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi quan tâm sự kiện", error: error.message });
  }
};

const unfollowEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;
    const event = await unfollowEvent(eventId, userId);
    res.status(200).json({ message: "Bỏ quan tâm sự kiện thành công", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi bỏ quan tâm sự kiện", error: error.message });
  }
};
const getEvents = async (req, res) => {
  try {
    const events = await getEventAll();
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách sự kiện", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await getEvent(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Sự kiện không tồn tại" });
    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin sự kiện", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await upEvent(req.params.id, req.body);
    if (!event)
      return res.status(404).json({ message: "Sự kiện không tồn tại" });
    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật sự kiện", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await delEvent(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Sự kiện không tồn tại" });
    res.status(200).json({ message: "Xóa sự kiện thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa sự kiện", error: error.message });
  }
};
const toggleFollowEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;
    const event = await toggleFollowEvent(eventId, userId);
    res.status(200).json({ message: "Toggle follow thành công", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi toggle follow sự kiện", error: error.message });
  }
};
module.exports = {
  toggleFollowEvents,
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  unfollowEvents,
  followEvents,
};
