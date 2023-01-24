const mongoose = require("mongoose")

const walletSchema = new mongoose.Schema({
  tag: String,
  walletCA: { type: String, required: true, lowercase: true },
  trackedByCA: { type: String, required: true, lowercase: true },
  chainId: Number,
  highlight: String,
  lastTimestamp: Number,
  dateAdded: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
})

const notificationSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  highlight: String,
  walletCA: { type: String, required: true, lowercase: true },
  chainId: Number,
  direction: String,
  hash: String,
  from: String,
  to: String,
  value: Number,
  method: String,
  timestamp: { type: Number, required: true },
  seen: { type: Boolean, default: false },
})

const userSchema = new mongoose.Schema({
  userCA: { type: String, required: true },
  trackedWallets: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Wallet" }],
  email: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  referral: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  notifications: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Notification" }],
})

const errorSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  message: {
    type: String,
    required: true,
  },
  errorStack: {
    type: String,
    required: true,
  },
})
// FUNCTIONS

// function to update the lastTimestamp field
walletSchema.methods.updateTimestamp = function () {
  this.lastTimestamp = Date.now() / 1000
  return this.save()
}

module.exports = {
  User: mongoose.model("User", userSchema),
  Wallet: mongoose.model("Wallet", walletSchema),
  Notification: mongoose.model("Notification", notificationSchema),
  Error: mongoose.model("Error", errorSchema),
}
