const fetch = require("node-fetch");
const { createError } = require("../database/error");
const {
  etherscanKey,
  bscscanKey,
  arbiscanKey,
  optimismscanKey,
  blastscanKey,
} = require("../config/apiKeys");

async function bscScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${bscscanKey}`
  );
  let result = await response.json();
  return result.result;
}

async function ethScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${etherscanKey}`
  );
  let result = await response.json();
  return result.result;
}

async function goerliScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${etherscanKey}`
  );
  let result = await response.json();
  return result.result;
}

async function arbitrumScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api.arbiscan.io/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${arbiscanKey}`
  );
  let result = await response.json();
  return result.result;
}

async function optimismScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${optimismscanKey}`
  );
  let result = await response.json();
  return result.result;
}

async function blastScanFetch(walletCA, block = 0) {
  let response = await fetch(
    `https://api.blastscan.io/api?module=account&action=txlist&address=${walletCA}&startblock=${block}&endblock=99999999&apikey=${blastscanKey}`
  );
  let result = await response.json();
  return result.result;
}

async function fetchHistory(walletCA, chain, block) {
  try {
    let response;
    if (chain == "1")
      response = await ethScanFetch(walletCA, block || undefined);
    if (chain == "56")
      response = await bscScanFetch(walletCA, block || undefined);
    if (chain == "5")
      response = await goerliScanFetch(walletCA, block || undefined);
    if (chain == "42161")
      response = await arbitrumScanFetch(walletCA, block || undefined);
    if (chain == "10")
      response = await optimismScanFetch(walletCA, block || undefined);
    if (chain == "81457")
      response = await blastScanFetch(walletCA, block || undefined);

    let history = response;
    return history.reverse();
  } catch (error) {
    createError(error);
    throw new Error(error.reason);
  }
}

async function getLatestTimestamp(walletCA, chainId) {
  let history = await fetchHistory(walletCA, chainId);
  if (!history[0]?.timeStamp) return 0;
  return history[0].timeStamp;
}

module.exports = { fetchHistory, getLatestTimestamp };
