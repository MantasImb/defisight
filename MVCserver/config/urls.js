require("dotenv").config()

const goerliSocket = process.env.goerliurl
const mainnetSocket = process.env.etherurl
const binanceSocket = "https://bsc-dataseed.binance.org"
const dbUrl = process.env.dburl
const origin = process.env.origin

module.exports = { goerliSocket, mainnetSocket, binanceSocket, dbUrl, origin }
