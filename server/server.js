const express = require("express")
const app = express()
const port = 4000
const cors = require("cors")

const ethers = require("ethers")
require("dotenv").config()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// CONSTANTS

const network = "goerli"

let WETH, socket
let balances = []
let trackedWallets = []

if (network === "goerli") {
  WETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6" // GOERLITESTNET
  socket = process.env.goerliurl
}

// UTILITIES

function logWithStamp(message) {
  let date = new Date()
  console.log(
    `${
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      ("0" + date.getSeconds()).slice(-2)
    } || ${message}`
  )
}

// ETHEREUM INITIALISATION

const privateKey = process.env.privatekey
const etherscanKey = process.env.etherscankey

const etherscanProvider = new ethers.providers.EtherscanProvider(
  network,
  etherscanKey
)

const provider = new ethers.providers.JsonRpcProvider(socket)

const signer = new ethers.Wallet(privateKey, provider) // UNNECESSARY

// MongoDB FUNCTIONALITY

async function getWallets() {
  trackedWallets = [
    {
      walletCA: "0xFF05c2Bc8461622359F33dbea618bb028D943eCE",
      users: ["0xfdb4640119f214ab6ce6fc145897378a1e6a6f20"],
    },
    {
      walletCA: "0x37B68d47E2884923fF9Ea5532d058D18cFA6Ec84",
      users: ["0xfdb4640119f214ab6ce6fc145897378a1e6a6f20"],
    },
  ]
}

// FUNCTIONALITY

async function fetchHistories(userCA) {
  let history = []
  for (wallet of trackedWallets) {
    if (wallet.users.includes(userCA)) {
      const response = await etherscanProvider.getHistory(wallet.walletCA)
      history = history.concat(response)
    }
  }
  return history
}

async function fetchHistory(walletCA) {
  let response = await etherscanProvider.getHistory(walletCA)
  let history = response
  return history
}

async function main() {
  await getWallets()
}

main()

// SERVER

app.get("/", cors(), async (req, res) => {
  res.send(trackedWallets)
})

app.get("/history/:userCA/:trackedCA/:chainId", cors(), async (req, res) => {
  let { userCA, trackedCA, chainId } = req.params
  logWithStamp(`${userCA} logged on. Chain id: ${chainId}`)
  let history = await fetchHistory(trackedCA)
  res.json(history)
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
