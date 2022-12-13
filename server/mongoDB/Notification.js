const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  chainId: Number,
  from: String,
  to: String,
  value: Number,
  timestamp: { type: Number, required: true },
  seen: { type: Boolean, default: false },
})

module.exports = mongoose.model("Notification", notificationSchema)
