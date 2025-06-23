const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  followEvents,
  unfollowEvents,
} = require("../controllers/eventController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { uploadFields } = require("../middlewares/upload");

const router = express.Router();

router.get("/:id", getEventById);
router.get("/", getEvents);
router.post(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  uploadFields("Event-images", [{ name: "image", maxCount: 1 }]),
  createEvent
);
router.post("/:id/follow", authenticateUser, followEvents); // Quan tâm sự kiện
router.post("/:id/unfollow", authenticateUser, unfollowEvents); // Bỏ quan tâm sự kiện

router.put("/:id", authenticateUser, authorizeRoles(["admin"]), updateEvent);
router.delete("/:id", authenticateUser, authorizeRoles(["admin"]), deleteEvent);

module.exports = router;
