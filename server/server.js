const express = require("express")
const app = express()
const port = 4000
const cors = require("cors")
const ethers = require("ethers")

const fs = require("fs")
const db = require("./mongoDB/script")

require("dotenv").config()

// Method dictionary
const ethdictionary = require("./ethmethods.json")

// Utility function imports
const getAge = require("./getAge")
const shortenAddress = require("./shortenAddress")

// Express config
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Constants

let WETH, mainnetSocket, goerliSocket, binanceSocket
let balances = []
let trackedWallets = []

WETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6" // GOERLITESTNET
goerliSocket = process.env.goerliurl
mainnetSocket = process.env.etherurl
binanceSocket = "https://bsc-dataseed.binance.org"

// Utilities
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
const bscscanKey = process.env.bscscankey

const goerliProvider = new ethers.providers.JsonRpcProvider(goerliSocket)
const mainnetProvider = new ethers.providers.JsonRpcProvider(mainnetSocket)
const binanceProvider = new ethers.providers.JsonRpcProvider(binanceSocket)

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

async function bscScanFetch(walletCA) {
  let response = await fetch(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${walletCA}&startblock=0&endblock=99999999&apikey=${bscscanKey}`
  )
  let result = await response.json()
  return result.result
}

async function ethScanFetch(walletCA) {
  let response = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${walletCA}&startblock=0&endblock=99999999&apikey=${etherscanKey}`
  )
  let result = await response.json()
  return result.result
}

async function fetchHistory(walletCA, chain) {
  try {
    let response
    if (chain == "1") response = await ethScanFetch(walletCA)
    if (chain == "56") response = await bscScanFetch(walletCA)

    let history = response
    return history.reverse()
  } catch (error) {
    console.log(error)
    throw new Error(error.reason)
  }
}

function formatHistory(history) {
  let formatted = []
  for (const item of history) {
    let method = item.methodId
    if (method == "0x") method = "Transfer"
    if (item.functionName && item.functionName.length) {
      camelCase = item.functionName
      let capitalized = camelCase[0].toUpperCase() + camelCase.substring(1)
      method = capitalized
        .split("(")[0]
        .replace(/([A-Z])/g, " $1")
        .trim()
    }
    let newRecord = {
      method: method,
      value: ethers.utils.formatEther(item.value).slice(0, 6),
      timestamp: item.timeStamp,
      from: item.from,
      to: item.to,
      hash: item.hash,
      bonus: {
        block: item.blockNumber,
        gas: item.gasUsed,
        gasPrice: item.gasPrice,
        gasUsed: item.gasUsed,
        status: item.txreceipt_status,
        isError: item.isError,
        nonce: item.nonce,
      },
    }

    formatted.push(newRecord)
  }
  return formatted
}

async function getLatestTimestamp(walletCA, chainId) {
  let history = await fetchHistory(walletCA, chainId)
  if (history[0].timeStamp) return history[0].timeStamp
  if (history[0].timestamp) return history[0].timestamp
}

async function main() {
  await getWallets()
  // let history = await fetchHistory("0x0e8E460ca953C347Be15b23780b3F1a0446BEa30")
  // let result = formatHistory(history)

  // console.log(result)
}

main()

// SERVER

app.get("/", cors(), async (req, res) => {
  if (!trackedWallets.length) res.send("No wallets tracked")
  res.send(trackedWallets)
})

app.get("/history/:trackedCA/:chainId", cors(), async (req, res) => {
  try {
    let { trackedCA, chainId } = req.params
    console.log(chainId + " " + trackedCA)
    let history = await fetchHistory(trackedCA, chainId)
    let formatted
    formatted = formatHistory(history)
    res.json(formatted)
  } catch (error) {
    console.log(error)
    res.sendStatus(404)
  }
})

app.get("/trackedwallets/:userCA", cors(), async (req, res) => {
  try {
    let { userCA } = req.params
    let wallets = await db.getWallets(userCA)
    let updatedWallets = []
    for (const wallet of wallets) {
      // let balance = await getBalance(wallet.walletCA, wallet.chainId)
      let updatedWallet = {
        tag: wallet.tag,
        walletCA: wallet.walletCA,
        chainId: wallet.chainId,
        highlight: wallet.highlight,
        lastTimestamp: wallet.lastTimestamp,
        id: wallet._id,
      }
      updatedWallets.push(updatedWallet)
    }
    res.json(updatedWallets)
  } catch (error) {
    res.json(error)
  }
})

app.post("/postwallet", cors(), async (req, res) => {
  try {
    let { body } = req
    let latestTimestamp = await getLatestTimestamp(body.address, body.chainId)
    let wallet = await db.addWallet(
      body.currentAccount,
      body.address,
      body.tag,
      body.chainId,
      body.highlight,
      latestTimestamp
    )
    res.json(wallet)
  } catch (error) {
    res.sendStatus(404)
  }
})

app.delete("/deletewallet/:id", cors(), async (req, res) => {
  let { id } = req.params
  await db.deleteWallet(id)
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

// Deprecated functions

// async function getBalance(walletCA, chainId) {
//     try {
//       let provider
//       if (chainId == "1") provider = mainnetProvider
//       if (chainId == "5") provider = goerliProvider
//       // if (chainId== "56") provider = binanceProvider
//       let response = await provider.getBalance(walletCA)
//       let balance = ethers.utils.formatEther(response)
//       return balance.slice(0, 5)
//     } catch (error) {}
//   }

// async function fetchHistories(userCA) {
//   let history = []
//   for (wallet of trackedWallets) {
//     if (wallet.users.includes(userCA)) {
//       const response = await etherscanProvider.getHistory(wallet.walletCA)
//       history = history.concat(response)
//     }
//   }
//   return history
// }

// function getMethodName(id) {
//   const res = fetch(
//     `https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=${id}`
//   )
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.count > 0)
//         return res.results[res.results.length - 1].text_signature
//       return "unregistered"
//     })
//   return res
// }

// async function checkMethodsEth(history) {
//   let ids = []
//   for (const tx of history) {
//     let methodId = tx.data.slice(0, 10)
//     if (!ids.includes(methodId) && !(methodId in ethdictionary)) {
//       ids.push(methodId)
//     }
//   }
//   let promises = []
//   for (const id of ids) {
//     let name = getMethodName(id)
//     promises.push(name)
//   }
//   Promise.all(promises).then((results) => {
//     console.log(results)
//     for (let i = 0; i < results.length; i++) {
//       const name = results[i]
//       if (name && name.length) {
//         let capitalized = name[0].toUpperCase() + name.substring(1)
//         let formatted = capitalized
//           .split("(")[0]
//           .replace(/([A-Z])/g, " $1")
//           .trim()
//         ethdictionary[ids[i]] = formatted
//         console.log(`New method found: {${ids[i]}: ${formatted}}`)
//       }
//     }
//     fs.writeFile("./ethmethods.json", JSON.stringify(ethdictionary), (err) => {
//       if (err) console.log("Error writing file:", err)
//     })
//   })
// }

// function formatHistory(history) {
//   let formatted = []
//   console.log(history)
//   for (const item of history) {
//     let method = item.data.slice(0, 10)
//     if (method in ethdictionary) {
//       method = ethdictionary[method]
//     }
//     let newRecord = {
//       method: method,
//       value: ethers.utils.formatEther(item.value).slice(0, 6),
//       timestamp: item.timestamp,
//       from: item.from,
//       to: item.to,
//       hash: item.hash,
//       bonus: {
//         block: item.blockNumber,
//         gas: item.gasUsed,
//         gasPrice: item.gasPrice,
//         status: item.txreceipt_status,
//         isError: item.isError,
//         nonce: item.nonce,
//       },
//     }

//     formatted.push(newRecord)
//   }
//   return formatted
// }
