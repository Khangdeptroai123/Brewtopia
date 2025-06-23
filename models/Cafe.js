// models/Cafe.js
const mongoose = require("mongoose");
const defaultOpeningHour = () => ({ open: "08:00", close: "22:00" });

const CafeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopName: { type: String, default: null },
    status: { type: String, enum: ["pending", "success"], default: "pending" },
    address: {
      street: { type: String, default: null },
      ward: { type: String, default: null },
      district: { type: String, default: null },
      city: { type: String, default: null },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
        index: "2dsphere",
      },
    },
    email: {
      type: String,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
      default: null,
    },
    phoneNumber: { type: String, default: null },
    taxInfo: {
      taxCode: { type: String, default: null },
      businessType: {
        type: String,
        enum: [
          "Traditional",
          "Take-away",
          "Garden cafe",
          "Book cafe",
          "Acoustic cafe",
          "Other",
        ],
        default: "Other",
      },
    },
    identification: {
      nationality: { type: String, default: null },
      citizenIdImage: { type: String, default: null },
    },
    description: { type: String, default: null },
    image: { type: String, default: null },
    openingHours: {
      monday: { type: Object, default: defaultOpeningHour },
      tuesday: { type: Object, default: defaultOpeningHour },
      wednesday: { type: Object, default: defaultOpeningHour },
      thursday: { type: Object, default: defaultOpeningHour },
      friday: { type: Object, default: defaultOpeningHour },
      saturday: { type: Object, default: defaultOpeningHour },
      sunday: { type: Object, default: defaultOpeningHour },
    },
    services: [{ type: String }],
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cafe = mongoose.model("Cafes", CafeSchema);
module.exports = Cafe;
