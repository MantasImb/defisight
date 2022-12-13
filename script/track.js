const ethers = require("ethers")
require("dotenv").config()

// CONSTANTS

const network = "goerli"

let WETH, socket
let balances = []

if (network === "goerli") {
  WETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6" // GOERLITESTNET
  socket = process.env.goerliurl
}

const privateKey = process.env.privatekey
const etherscanKey = process.env.etherscankey

const etherscanProvider = new ethers.providers.EtherscanProvider(
  network,
  etherscanKey
)

const provider = new ethers.providers.JsonRpcProvider(socket)

const signer = new ethers.Wallet(privateKey, provider) // UNNECESSARY

const trackedWallets = [
  "0xFF05c2Bc8461622359F33dbea618bb028D943eCE",
  "0x37B68d47E2884923fF9Ea5532d058D18cFA6Ec84",
]

// INITIALISATION

const WETHContract = new ethers.Contract(
  WETH,
  [
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      type: "function",
    },
    {
      name: "balanceOf",
      type: "function",
      inputs: [{ name: "_owner", type: "address" }],
      outputs: [{ name: "balance", type: "uint256" }],
      constant: true,
      payable: false,
    },
  ],
  signer
)

// EVENT LISTENERS

// provider.on("block", (blockNumber) => {
//   console.log(blockNumber)
//   // getBlockAccounts(blockNumber)
// })

// FUNCTIONALITY

// creates a listener for an account balance change (incomplete)
async function createBalanceListener(accountCA) {
  let oldBalance = await provider.getBalance(accountCA)
}

// logs all accounts that sent transactions in a block
async function getBlockAccounts(blockNumber) {
  const block = await provider.getBlock(blockNumber)
  for (const tx of block.transactions) {
    const transaction = await provider.getTransaction(tx)
    const from = transaction.from
    console.log(from)
  }
}

// gets block info
async function getBlock(blockNumber) {
  const block = await provider.getBlock(blockNumber)
  console.log(block.transactions.length)
}

// gets transaction receipt
async function getTransaction(txHash) {
  const transaction = await provider.getTransaction(txHash)
  console.log(transaction)
}

// gets all account history
async function getAccountHistory(accountCA) {
  const history = await etherscanProvider.getHistory(accountCA)
  console.log(history.length)
  for (const tx of history) {
    console.log(tx.hash)
  }
}

// gets balance of an account
async function getBalance(accountCA) {
  const balance = await provider.getBalance(trackedWallets[0])
  console.log(ethers.utils.formatEther(balance))
}

// gets balances for all accounts in array
async function getBalances2(array) {
  for (const walletCA of array) {
    const balance = await provider.getBalance(walletCA)
    const item = {
      address: walletCA,
      balance,
    }
    balances.push(item)
  }
  console.log("Balances fetched.")
}

// get balances fast
function getBalances(array) {
  let promises = []
  for (const walletCA of array) {
    let promise = provider.getBalance(walletCA)
    promises.push(promise)
  }
  Promise.all(promises)
    .then((results) => {
      for (let i = 0; i < array.length; i++) {
        let item = {
          address: array[i],
          balance: results[i],
        }
        balances.push(item)
      }
    })
    .catch((e) => console.log(e))
  console.log("Balances fetched.")
}

// looks for difference in previous balance vs now and gets transactions if difference is found
async function balanceChanged(wallet, blockNumber) {
  const newBalance = await provider.getBalance(wallet.address)
  if (!newBalance.eq(wallet.balance)) {
    let txs = await etherscanProvider.getHistory(wallet.address, blockNumber)
    console.log(
      `Balance for wallet ${wallet.address} has changed on block ${blockNumber}. Transactions:`
    )
    console.log(txs)
  }
  wallet.balance = newBalance
}

async function balanceChangedDelayed(wallet, blockNumber) {
  const newBalance = await provider.getBalance(wallet.address)
  if (!newBalance.eq(wallet.balance)) {
    setTimeout(async () => {
      let txs = await etherscanProvider.getHistory(wallet.address, blockNumber)
      console.log(
        `Balance for wallet ${wallet.address} has changed on block ${blockNumber}. Transactions:`
      )
      console.log(txs)
    }, 15 * 1000)
  }
  wallet.balance = newBalance
}

async function main() {
  getBalances(trackedWallets)

  provider.on("block", (blockNumber) => {
    console.log("Block number: ", blockNumber)
    for (const wallet of balances) {
      balanceChangedDelayed(wallet, blockNumber)
    }
  })

  // let txs = await etherscanProvider.getHistory(
  //   "0xFF05c2Bc8461622359F33dbea618bb028D943eCE",
  //   8031284
  // )
  // console.log(txs)
}

main()
