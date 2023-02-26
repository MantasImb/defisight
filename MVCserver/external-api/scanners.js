const fetch = require("node-fetch")
const { createError } = require("../database/error")
const { etherscanKey, bscscanKey } = require("../config/apiKeys")

async function bscScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${bscscanKey}`
  )
  let result = await response.json()
  return result.result
}

async function ethScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${etherscanKey}`
  )
  let result = await response.json()
  return result.result
}

async function goerliScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${etherscanKey}`
  )
  let result = await response.json()
  return result.result
}

async function fetchHistory(walletCA, chain, block) {
  try {
    let response
    if (chain == "1")
      response = await ethScanFetch(walletCA, block || undefined)
    if (chain == "56")
      response = await bscScanFetch(walletCA, block || undefined)
    if (chain == "5")
      response = await goerliScanFetch(walletCA, block || undefined)

    let history = response
    return history.reverse()
  } catch (error) {
    createError(error)
    throw new Error(error.reason)
  }
}

async function getLatestTimestamp(walletCA, chainId) {
  let history = await fetchHistory(walletCA, chainId)
  if (!history[0]?.timeStamp) return 0
  return history[0].timeStamp
}

module.exports = { fetchHistory, getLatestTimestamp }
