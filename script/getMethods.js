//make a listener for blocks on ethereum blockchain
//get all transactions on the block
//get every transaction's method id
//check if the method id definition is already in the methods.json
//if not - look for a name of that method id in the database
//format the name into human readable
//append the id:name inside of a json file methods.json

const ethers = require("ethers")
require("dotenv").config()
const fs = require("fs")

const address = ""
const network = "homestead"

const dictionary = {
  "0x7ff36ab5": "Swap",
  "0x095ea7b3": "Approve",
  "0x38ed1739": "Swap",
  "0x2e1a7d4d": "Withdraw",
  "0x": "Transfer",
  "0xa1db9782": "Withdraw",
  "0xfdacd576": "Set Completed",
  "0xa9059cbb": "Transfer",
  "0xe8e33700": "Add Liquidity",
}

// file system
console.log(process.cwd())
// const data = fs.readFile(process.cwd)

// Ethereum

const socket = process.env.etherurl
const provider = new ethers.providers.JsonRpcProvider(socket)

const registryAbi = [
  {
    constant: true,
    inputs: [{ name: "", type: "bytes4" }],
    name: "entries",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    type: "function",
  },
]

const etherscanKey = process.env.etherscankey

const etherscanProvider = new ethers.providers.EtherscanProvider(
  network,
  etherscanKey
)

const registry = new ethers.Contract(
  "0x44691B39d1a75dC4E0A0346CBB15E310e6ED1E86",
  registryAbi,
  provider
)

function getMethodName(id) {
  const name = registry
    .entries(id)
    .then((res) => res)
    .catch((err) => {})
  return name
}

async function fetchHistory(walletCA) {
  try {
    let response = await etherscanProvider.getHistory(walletCA)
    let history = response
    return history
  } catch (error) {
    throw new Error(error.reason)
  }
}

async function main() {
  let history = await fetchHistory(address)
  let checked = []
  for (const item of history) {
    let data = item.data.slice(0, 10)
    if (!(data in dictionary) && !checked.includes(data)) {
      let name = await getMethodName(data)
      checked.push(data)
      console.log(`"${data}": "${name}",`)
    }
  }
}

// main()
