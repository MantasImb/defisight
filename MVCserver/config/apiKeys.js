require("dotenv").config()

const etherscanKey = process.env.etherscankey
const bscscanKey = process.env.bscscankey

module.exports = { etherscanKey, bscscanKey }
