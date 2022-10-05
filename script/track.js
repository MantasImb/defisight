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

// creates a listener for an account balance change
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
async function getBalances(array) {
  for (const walletCA of trackedWallets) {
    const balance = await provider.getBalance(walletCA)
    const item = {
      address: walletCA,
      balance,
    }
    balances.push(item)
  }
  console.log("Balances fetched.")
}

// looks for difference in previous balance vs now and logs if difference is found
async function balanceChanged(wallet) {
  const newBalance = await provider.getBalance(wallet.address)
  console.log(newBalance)
  console.log(wallet.balance)
  console.log(newBalance.eq(wallet.balance))
  if (!newBalance.eq(wallet.balance)) {
    console.log(`Balance changed for wallet: ${wallet.address}`)
  }
}

async function main() {
  await getBalances(trackedWallets)

  provider.on("block", (blockNumber) => {
    console.log("Block number: ", blockNumber)
    for (const wallet of balances) {
      balanceChanged(wallet)
    }
  })
}

main()
