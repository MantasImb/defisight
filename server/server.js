// TODO: add error handling to show errors on "/" request and store them in an object

const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const app = express()
const port = 4000
const cors = require("cors")
const ethers = require("ethers")
const fetch = require("node-fetch")

const fs = require("fs")
const db = require("./mongoDB/script")

require("dotenv").config()

// Utility function imports
const getAge = require("./getAge")
const shortenAddress = require("./shortenAddress")

// Express and Socket.io config
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:5173",
    origin: "https://chainwatcher.app",
    methods: ["GET", "POST"],
  },
})

httpServer.listen(4000, () => {
  console.log("Server listening on port 4000")
})

// Constants

let WETH, mainnetSocket, goerliSocket, binanceSocket
let wallets = {
  1: [],
  56: [],
  5: [],
}

const dbUrl = process.env.dburl

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

// ETHEREUM CONFIG

const privateKey = process.env.privatekey
const etherscanKey = process.env.etherscankey
const bscscanKey = process.env.bscscankey

let goerliProvider, mainnetProvider, binanceProvider

// MongoDB FUNCTIONALITY
// fetches all wallets from the database, updates the wallets object, filters out duplicates
async function getAllWallets() {
  try {
    for (let chain in wallets) {
      let list = await db.getAllChainWallets(chain)
      let formattedList = []
      for (let wallet of list) {
        let index = formattedList.findIndex(
          (item) => item.walletCA === wallet.walletCA
        )

        if (index > -1) {
          formattedList[index].users.push({
            userCA: wallet.trackedByCA,
            highlight: wallet.highlight,
            tag: wallet.tag,
          })
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
          }
          formattedList.push(formattedWallet)
        }
      }
      wallets[chain] = formattedList
    }
  } catch (error) {
    db.createError(error)
  }
}

// SOCKET.IO FUNCTIONALITY

let connectedUsers = {}

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)
  // Validates and sends the user their notifications
  socket.on("validate", async (walletCA) => {
    connectedUsers[walletCA] = socket.id
    console.log(`User validated: ${walletCA}`)
    let notifications = await db.getNotifications(walletCA)
    if (notifications) {
      socket.emit("notifications", notifications)
    }
  })

  // Notification status update (seen and seenAll)
  socket.on("notificationSeen", async (notificationId) => {
    await db.notificationSeen(notificationId)
  })

  socket.on("notificationsSeenAll", async (walletCA) => {
    await db.notificationSeenAll(walletCA)
  })

  // On user disconnect, removes the user from the connectedUsers object
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`)
    for (let user in connectedUsers) {
      if (connectedUsers[user] === socket.id) {
        delete connectedUsers[user]
      }
    }
  })
})

// FUNCTIONALITY

// Fetching functionality to fetch the history of a wallet from various scanners
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

// fetches the history of a wallet
async function fetchHistory(walletCA, chain) {
  try {
    let response
    if (chain == "1") response = await ethScanFetch(walletCA)
    if (chain == "56") response = await bscScanFetch(walletCA)
    if (chain == "5") response = await goerliScanFetch(walletCA)

    let history = response
    return history.reverse()
  } catch (error) {
    db.createError(error)
    throw new Error(error.reason)
  }
}

// formats the function name to be more readable
function formatFunctionName(item) {
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
  return method
}

// formats the history object to be ready to render on client
function formatHistory(history) {
  let formatted = []
  for (const item of history) {
    let method = formatFunctionName(item)
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

// returns the latest timestamp of the wallet
async function getLatestTimestamp(walletCA, chainId) {
  let history = await fetchHistory(walletCA, chainId)
  if (history[0].timeStamp) return history[0].timeStamp
}

// TODO: email functionality
async function sendEmail() {
  console.log("sending email")
}

// creates a notification object, saves it to the database and sends it to the client, or emails it to the user if the user has an email
async function handleNotifications(wallet, chainId, transactions) {
  for (const user of wallet.users) {
    for (const transaction of transactions) {
      if (transaction.to === wallet.walletCA) {
        transaction.direction = "in"
      } else {
        transaction.direction = "out"
      }

      let method = formatFunctionName(transaction)

      console.log(transaction)

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
      }

      let id = await db.addNotification(user.userCA, notification)
      notification._id = id

      if (connectedUsers[user.userCA]) {
        io.to(connectedUsers[user.userCA]).emit("notification", notification)
      }
    }
  }
}

// fetches all the balances on all the wallets on all the chains on the wallets object
async function getBalances() {
  for (const chain in wallets) {
    let provider
    if (chain === "1") provider = mainnetProvider
    if (chain === "56") provider = binanceProvider
    if (chain === "5") provider = goerliProvider
    let promises = []
    for (const wallet of wallets[chain]) {
      let promise = provider.getBalance(wallet.walletCA)
      promises.push(promise)
    }
    await Promise.all(promises)
      .then((results) => {
        for (let i = 0; i < results.length; i++) {
          wallets[chain][i].balance = results[i]
        }

        console.log("Balances fetched for chain: " + chain)
      })
      .catch((error) => db.createError(error))
  }
}
// checks if the balance has changed and if so, fetches the transactions after a 15s delay
// (waits for the transactions to be indexed by etherscan)
// this is a workaround for the fact that etherscan does not provide a websocket API
// then updates the balance in the wallets object and sends the notifications
async function balanceChangedDelayed(wallet, blockNumber, provider, chain) {
  const newBalance = await provider.getBalance(wallet.walletCA)
  // return if the balance has not changed
  if (newBalance.eq(wallet.balance)) return
  // update the timestamp of the wallet on the chain.
  // can be updated in the future for the db to do this automatically
  db.updateTimestamp(wallet.walletCA, chain)
  setTimeout(async () => {
    let txs
    if (chain == "1") txs = await ethScanFetch(wallet.walletCA, blockNumber)
    if (chain == "56") txs = await bscScanFetch(wallet.walletCA, blockNumber)
    if (chain == "5") txs = await goerliScanFetch(wallet.walletCA, blockNumber)
    console.log(
      `Balance for wallet ${wallet.walletCA} has changed on block ${blockNumber}. Fetching transactions.`
    )
    handleNotifications(wallet, chain, txs)
  }, 30 * 1000)

  wallet.balance = newBalance
}

async function main() {
  try {
    await db.connect(dbUrl)
    goerliProvider = new ethers.providers.JsonRpcProvider(goerliSocket)
    mainnetProvider = new ethers.providers.JsonRpcProvider(mainnetSocket)
    binanceProvider = new ethers.providers.JsonRpcProvider(binanceSocket)
    // fetch wallets from db and update wallets object
    await getAllWallets()
    // fetch balances for all wallets and update wallets object
    await getBalances()
    // add a new block event listener for each chain
    for (const chain in wallets) {
      let provider
      if (chain === "1") provider = mainnetProvider
      if (chain === "56") provider = binanceProvider
      if (chain === "5") provider = goerliProvider
      provider.on("block", (blockNumber) => {
        // console.log(`Chain: ${chain}. Block number: ${blockNumber}.`)
        for (const wallet of wallets[chain]) {
          balanceChangedDelayed(wallet, blockNumber, provider, chain)
        }
      })
      console.log("Listening for blocks on chain: " + chain)
    }
  } catch (error) {
    db.createError(error)
    main()
  }
}

main()

// SERVER
// returns info about the state of the server
app.get("/", cors(), async (req, res) => {
  res.json({
    wallets,
    mongoose: db.mongoose.connection.readyState,
    errors: db.errorArray,
  })
})

app.get("/errors", cors(), async (req, res) => {
  let errors = await db.fetchErrors()
  res.json(errors)
})

// returns the history of a requested wallet
app.get("/history/:trackedCA/:chainId", cors(), async (req, res) => {
  try {
    let { trackedCA, chainId } = req.params
    let history = await fetchHistory(trackedCA, chainId)
    let formatted
    formatted = formatHistory(history)
    res.json(formatted)
  } catch (error) {
    db.createError(error)
    res.sendStatus(404)
  }
})

// returns all the tracked wallets of a user. Used to populate the table on the client
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
    db.createError(error)
    res.json(error)
  }
})

// adds a new wallet to the db, returns the new wallet to the client
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
    // Adds wallet to the wallets object
    let index = wallets[body.chainId].findIndex(
      (item) => item.walletCA === body.address
    )

    if (index > -1) {
      wallets[body.chainId][index].users.push({
        userCA: body.currentAccount,
        highlight: body.highlight,
        tag: body.tag,
      })
    } else {
      let provider
      if (body.chainId == "1") provider = mainnetProvider
      if (body.chainId == "56") provider = binanceProvider
      if (body.chainId == "5") provider = goerliProvider

      let balance = await provider.getBalance(body.address)

      wallets[body.chainId].push({
        walletCA: body.address,
        users: [
          {
            userCA: body.currentAccount,
            highlight: body.highlight,
            tag: body.tag,
          },
        ],
        balance: balance,
      })
    }
    res.json(wallet)
  } catch (error) {
    db.createError(error)
    res.sendStatus(404)
  }
})

// deletes a wallet from the db and the wallets object
app.delete("/deletewallet/:userCA/:id", cors(), async (req, res) => {
  let { userCA, id } = req.params
  let wallet = await db.deleteWallet(userCA, id)
  // delete wallet from the wallets object
  let index = wallets[wallet.chainId].findIndex(
    (item) => item.walletCA === wallet.walletCA
  )
  if (index > -1) {
    let userIndex = wallets[wallet.chainId][index].users.findIndex(
      (item) => item.userCA === userCA
    )
    if (userIndex > -1) {
      wallets[wallet.chainId][index].users.splice(userIndex, 1)
    }
  }
  if (wallets[wallet.chainId][index].users.length === 0) {
    wallets[wallet.chainId].splice(index, 1)
  }
  res.sendStatus(200)
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
