const mongoose = require("mongoose")

const walletSchema = new mongoose.Schema({
  tag: String,
  walletCA: { type: String, required: true, lowercase: true },
  chainId: Number,
  highlight: String,
  lastTimestamp: Number,
  dateAdded: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
})

module.exports = mongoose.model("Wallet", walletSchema)
