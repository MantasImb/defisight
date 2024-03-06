const ethers = require("ethers");

const {
  getAllChainWallets,
  updateWalletTimestamp,
} = require("../database/wallet");
const { createError } = require("../database/error");
const { addNotification } = require("../database/notification");

const { fetchHistory } = require("../external-api/scanners");

const { connectedUsers } = require("../websocket/notifications");
const io = require("../websocket/setup");

const {
  mainnetSocket,
  goerliSocket,
  binanceSocket,
  arbitrumSocket,
  optimismSocket,
  blastSocket,
} = require("../config/urls");

const formatFunctionName = require("../utilities/formatFunctionName");

// Could be better performance-wise to use Map with Set for the wallets object
let wallets = {
  1: [], // mainnet
  56: [], // binance
  5: [], // goerli
  42161: [], // arbitrum
  10: [], // optimism
  81457: [], // blast
};

async function getAllWallets() {
  try {
    for (let chain in wallets) {
      let list = await getAllChainWallets(chain);
      let formattedList = [];
      for (let wallet of list) {
        let index = formattedList.findIndex(
          (item) => item.walletCA === wallet.walletCA
        );

        if (index > -1) {
          formattedList[index].users.push({
            userCA: wallet.trackedByCA,
            highlight: wallet.highlight,
            tag: wallet.tag,
          });
        } else {
          let formattedWallet = {
            walletCA: wallet.walletCA,
            users: [
              {
                userCA: wallet.trackedByCA,
                highlight: wallet.highlight,
                tag: wallet.tag,
              },
            ],
          };
          formattedList.push(formattedWallet);
        }
      }
      wallets[chain] = formattedList;
    }
  } catch (error) {
    createError(error);
  }
}

// fetches all the balances on all the wallets on all the chains on the wallets object
async function getBalances() {
  for (const chain in wallets) {
    let provider;
    if (chain == "1")
      provider = new ethers.providers.JsonRpcProvider(mainnetSocket);
    if (chain == "56")
      provider = new ethers.providers.JsonRpcProvider(binanceSocket);
    if (chain == "5")
      provider = new ethers.providers.JsonRpcProvider(goerliSocket);
    if (chain == "42161")
      provider = new ethers.providers.JsonRpcProvider(arbitrumSocket);
    if (chain == "10")
      provider = new ethers.providers.JsonRpcProvider(optimismSocket);
    if (chain == "81457")
      provider = new ethers.providers.JsonRpcProvider(blastSocket);
    let promises = [];
    for (const wallet of wallets[chain]) {
      let promise = provider.getBalance(wallet.walletCA);
      promises.push(promise);
    }
    await Promise.all(promises)
      .then((results) => {
        for (let i = 0; i < results.length; i++) {
          wallets[chain][i].balance = results[i];
        }

        console.log("Balances fetched for chain: " + chain);
      })
      .catch((error) => createError(error));
  }
}

// checks if the balance has changed and if so, fetches the transactions after a 15s delay
// (waits for the transactions to be indexed by etherscan)
// this is a workaround for the fact that etherscan does not provide a websocket API
// then updates the balance in the wallets object and sends the notifications
async function balanceChangedDelayed(wallet, blockNumber, provider, chain) {
  try {
    const newBalance = await provider.getBalance(wallet.walletCA);
    // return if the balance has not changed
    if (newBalance.eq(wallet.balance)) return;
    // update the timestamp of the wallet on the chain. (can be updated in the future for the db to do this automatically)
    updateWalletTimestamp(wallet.walletCA, chain);
    setTimeout(async () => {
      let txs = await fetchHistory(wallet.walletCA, chain, blockNumber);
      console.log(
        `Balance for wallet ${wallet.walletCA} has changed on block ${blockNumber}. Fetching transactions.`
      );
      handleNotifications(wallet, chain, txs);
    }, 30 * 1000);

    wallet.balance = newBalance;
  } catch (error) {
    createError(error);
  }
}

async function handleNotifications(wallet, chainId, transactions) {
  for (const user of wallet.users) {
    for (const transaction of transactions) {
      if (transaction.to === wallet.walletCA) {
        transaction.direction = "in";
      } else {
        transaction.direction = "out";
      }

      let method = formatFunctionName(transaction);

      console.log(transaction);

      let notification = {
        tag: user.tag,
        walletCA: wallet.walletCA,
        chainId: chainId,
        direction: transaction.direction,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        method: method,
        timestamp: transaction.timeStamp,
        highlight: user.highlight,
        hash: transaction.hash,
      };

      let id = await addNotification(user.userCA, notification);
      notification._id = id;

      if (connectedUsers[user.userCA]) {
        io.to(connectedUsers[user.userCA]).emit("notification", notification);
      }
    }
  }
}

async function main() {
  try {
    const goerliProvider = new ethers.providers.JsonRpcProvider(goerliSocket);
    const mainnetProvider = new ethers.providers.JsonRpcProvider(mainnetSocket);
    const binanceProvider = new ethers.providers.JsonRpcProvider(binanceSocket);
    const arbitrumProvider = new ethers.providers.JsonRpcProvider(
      arbitrumSocket
    );
    const optimismProvider = new ethers.providers.JsonRpcProvider(
      optimismSocket
    );
    const blastProvider = new ethers.providers.JsonRpcProvider(blastSocket);

    await getAllWallets();
    await getBalances();

    // add a new block event listener for each chain
    for (const chain in wallets) {
      let provider;
      if (chain === "1") provider = mainnetProvider;
      if (chain === "56") provider = binanceProvider;
      if (chain === "5") provider = goerliProvider;
      if (chain === "42161") provider = arbitrumProvider;
      if (chain === "10") provider = optimismProvider;
      if (chain === "81457") provider = blastProvider;
      provider.on("block", (blockNumber) => {
        for (const wallet of wallets[chain]) {
          balanceChangedDelayed(wallet, blockNumber, provider, chain);
        }
      });
      console.log("Listening for blocks on chain: " + chain);
    }
  } catch (error) {
    createError(error);
    main();
  }
}

main();

module.exports = { wallets };
