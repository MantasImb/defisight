const mongoose = require("mongoose")
const { User, Wallet, Notification, Error } = require("./Schemas")

let errorArray = []

async function connect(url) {
  mongoose
    .connect(url)
    .then(() => console.log("DB connected"))
    .catch((e) => errorArray.push(e))
}

async function createError(error) {
  try {
    errorArray.push(error)
    const newError = await Error.create({
      message: error.message,
      errorStack: error.stack,
    })
    console.log(newError)
  } catch (error) {
    console.error(error)
  }
}

function fetchErrors() {
  try {
    const errors = Error.find()
    return errors
  } catch (error) {
    createError(error)
  }
}

async function createUser(userCA, referral) {
  try {
    const user = await User.create({
      userCA,
      referral,
    })
    return user
  } catch (error) {
    createError(error)
  }
}

async function findOrCreateUser(userCA, referral) {
  try {
    const userFound = await User.findOne({
      userCA,
    })
    if (userFound) {
      return userFound
    } else {
      let user = await createUser(userCA, referral)
      return user
    }
  } catch (error) {
    createError(error)
  }
}

async function addWallet(
  userCA,
  walletCA,
  tag,
  chainId,
  highlight,
  lastTimestamp,
  referral
) {
  try {
    let user = await findOrCreateUser(userCA, referral)
    let wallet = await Wallet.create({
      trackedByCA: userCA,
      tag,
      walletCA,
      chainId,
      highlight,
      lastTimestamp,
    })
    user.trackedWallets.push(wallet._id)
    user.save()
    return wallet
  } catch (error) {
    createError(error)
  }
}

async function getWallets(userCA) {
  try {
    let user = await findOrCreateUser(userCA)
    let list = await User.where("userCA")
      .equals(userCA)
      .populate("trackedWallets")
    let [{ trackedWallets }] = list
    return trackedWallets
  } catch (error) {
    createError(error)
  }
}

async function getAllChainWallets(chainId) {
  try {
    let wallets = await Wallet.find({ chainId: chainId })
    return wallets
  } catch (error) {
    createError(error)
  }
}

async function getUsersByWallet(walletCA) {
  try {
    let users = await User.find({ trackedWallets: walletCA })
    return users
  } catch (error) {
    createError(error)
  }
}

async function updateWallet(walletCA) {
  let wallet = await Wallet.find({ walletCA: walletCA })
  console.log(wallet)
}

async function deleteWallet(userCA, walletId) {
  try {
    let user = await User.findOne({ userCA: userCA })
    user.trackedWallets.pull(walletId)
    user.save()
    let wallet = await Wallet.findByIdAndDelete(walletId)
    return wallet
  } catch (error) {
    createError(error)
  }
}

async function updateTimestamp(walletCA, chainId) {
  try {
    let wallets = await Wallet.find({ walletCA: walletCA, chainId: chainId })
    for (const wallet of wallets) {
      wallet.updateTimestamp()
    }
  } catch (error) {
    createError(error)
  }
}

async function addNotification(userCA, notification) {
  try {
    let user = await User.findOne({ userCA })
    let newNotification = await Notification.create({
      ...notification,
    })
    // remove oldest notification if user has more than 25 notifications
    if (user.notifications.length >= 25) {
      await Notification.findOneAndDelete({
        _id: user.notifications[0],
      })
      user.notifications.shift()
    }
    user.notifications.push(newNotification._id)
    user.save()
    return newNotification._id
  } catch (error) {
    createError(error)
  }
}

async function getNotifications(userCA) {
  try {
    let list = await User.where("userCA")
      .equals(userCA)
      .populate("notifications")
    let [{ notifications }] = list
    if (notifications) {
      return notifications.reverse()
    }
  } catch (error) {
    createError(error)
  }
}

async function notificationSeenAll(userCA) {
  try {
    let user = await User.findOne({ userCA }).populate("notifications")
    user.notifications.forEach((notification) => {
      notification.seen = true
      notification.save()
    })
  } catch (error) {
    createError(error)
  }
}

async function notificationSeen(notificationId) {
  try {
    let notification = await Notification.findById(notificationId)
    notification.seen = true
    notification.save()
  } catch (error) {
    createError(error)
  }
}

module.exports = {
  User,
  Wallet,
  mongoose,
  connect,
  createError,
  fetchErrors,
  findOrCreateUser,
  addWallet,
  getWallets,
  getAllChainWallets,
  getUsersByWallet,
  updateWallet,
  deleteWallet,
  addNotification,
  getNotifications,
  notificationSeen,
  notificationSeenAll,
  updateTimestamp,
  errorArray,
}

// findOrCreateUser("0xff05c2bc8461622359f33dbea618bb028d943ece")
// addWallet(
//   "0xff05c2bc8461622359f33dbea618bb028d943ece",
//   "0xC93DBa0F419E1a527E8ee046A5Cd1fD40F6E0517",
//   "potato",
//   1,
//   "tealToLime"
// )
// updateWallet("0xC93DBa0F419E1a527E8ee046A5Cd1fD40F6E0517")

async function main() {}
main()
