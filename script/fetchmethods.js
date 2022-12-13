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
const dictionary = require("./methods.json")

const address = ""
const network = "homestead"

// file system

// const dictionary = fs.readFileSync(
//   "./script/methods.json",
//   "utf-8",
//   (err, file) => {
//     const data = JSON.parse(file)
//     return data
//   }
// )

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

provider.on("block", async (blockNum) => {
  console.log(blockNum)
  let blockInfo = await provider.getBlockWithTransactions(blockNum)
  let methodIds = []
  for (const tx of blockInfo.transactions) {
    let methodId = tx.data.slice(0, 10)
    if (!methodIds.includes(methodId) && !(methodId in dictionary)) {
      methodIds.push(methodId)
    }
  }
  let promises = []
  for (const id of methodIds) {
    let name = getMethodName(id)
    promises.push(name)
  }
  Promise.all(promises).then((results) => {
    for (let i = 0; i < results.length; i++) {
      const name = results[i]
      if (name && name.length) {
        let capitalized = name[0].toUpperCase() + name.substring(1)
        let formatted = capitalized
          .split("(")[0]
          .replace(/([A-Z])/g, " $1")
          .trim()
        dictionary[methodIds[i]] = formatted
        console.log(`${methodIds[i]}: ${formatted}`)
      }
    }
    fs.writeFile("./server/methods.json", JSON.stringify(dictionary), (err) => {
      if (err) console.log("Error writing file:", err)
    })
  })
})
