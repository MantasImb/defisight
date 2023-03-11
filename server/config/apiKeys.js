require("dotenv").config()

const etherscanKey = process.env.etherscankey
const bscscanKey = process.env.bscscankey
const arbiscanKey = process.env.arbiscankey
const optimismscanKey = process.env.optimismscankey

module.exports = { etherscanKey, bscscanKey, arbiscanKey, optimismscanKey }
