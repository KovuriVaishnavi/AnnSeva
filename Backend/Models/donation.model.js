const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
    },
    donarName: { type: String, required: true },
    foodItems: [{ type: String, required: true }],
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "taken", "completed"],
      default: "pending",
    },
    shelfLife: { type: Number, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    misc: { type: Boolean, default: false },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "ReceiverRequest" },
    message: { type: String },
    picture: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
