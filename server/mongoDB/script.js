const mongoose = require("mongoose")

mongoose
  .connect(
    // "mongodb://127.0.0.1/sightdb"
    "mongodb+srv://dbDeployer:check@chainwatcherc.fq1afa9.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e))

const User = require("./User")
const Wallet = require("./Wallet")

async function createUser(userCA, referral) {
  try {
    const user = await User.create({
      userCA,
      referral,
    })
    return user
  } catch (error) {
    console.error(error)
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
    console.error(error)
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
    console.log(error.message)
  }
}

async function getWallets(userCA) {
  try {
    let list = await User.where("userCA")
      .equals(userCA)
      .populate("trackedWallets")
    let [{ trackedWallets }] = list
    return trackedWallets
  } catch (error) {
    console.error(error)
  }
}

async function updateWallet(walletCA) {
  let wallet = await Wallet.find({ walletCA: walletCA })
  console.log(wallet)
}

async function deleteWallet(walletId) {
  try {
    let wallet = await Wallet.findByIdAndDelete(walletId)
    console.log(wallet)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  User,
  Wallet,
  findOrCreateUser,
  addWallet,
  getWallets,
  updateWallet,
  deleteWallet,
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

async function main() {
  deleteWallet("638b67eedf83a6d43ab6b95b")
}
// main()
