import React, { useState, useEffect } from "react"
import axios from "axios"
import { ethers } from "ethers"

export const APIContext = React.createContext()

const url = "server.chainwatcher.app"
const { ethereum } = window

export default function APIProvider({ children }) {
  // ETHEREUM

  const [currentAccount, setCurrentAccount] = useState()
  const [chainId, setChainId] = useState()

  const mainnetProvider = ethers.getDefaultProvider("https://rpc.ankr.com/eth")
  const bscProvider = ethers.getDefaultProvider(
    "https://bsc-dataseed.binance.org/"
  )

  async function checkIfWalletIsConnect() {
    try {
      if (!ethereum) return alert("Please install MetaMask.")

      const accounts = await ethereum.request({ method: "eth_accounts" })
      setChainId(window.ethereum.networkVersion)

      if (accounts.length) {
        setCurrentAccount(accounts[0])
      } else {
        console.log("No accounts found")
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function connectWallet() {
    try {
      if (!ethereum) return alert("Please install MetaMask.")

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      setCurrentAccount(accounts[0])
      setChainId(window.ethereum.networkVersion)
      window.location.reload()
    } catch (error) {
      console.log(error)
      throw new Error("No ethereum object")
    }
  }

  async function getBalance(walletCA, chainId) {
    let provider
    if (chainId == 1) provider = mainnetProvider
    if (chainId == 56) provider = bscProvider
    try {
      let balance = await provider.getBalance(walletCA)
      return ethers.utils.formatEther(balance)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  // SERVER API

  async function getHistory(accountCA, chainId) {
    // if (!currentAccount) return
    try {
      let response = await axios.get(`${url}history/${accountCA}/${chainId}`)

      console.log(response)
      let { data } = response
      console.log(`Fetched ${data.length} transactions`)
      return data
    } catch (error) {
      console.log(error)
      return error.code
    }
  }

  async function getWallets() {
    try {
      let response = await axios.get(`${url}trackedwallets/${currentAccount}`)
      // console.log(response)
      let { data } = response
      // console.log(data)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  async function postWallet({ tag, address, chainId, highlight }) {
    try {
      let response = await axios.post(`${url}postwallet`, {
        currentAccount,
        tag,
        address,
        chainId,
        highlight,
      })
      if (response) return response
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteWallet(id) {
    try {
      let response = await axios.delete(`${url}deletewallet/${id}`)
      if (response) return true
    } catch (error) {
      console.log(error)
      if (response) return false
    }
  }

  // ETHERSCAN API

  const etherscanProvider = new ethers.providers.EtherscanProvider(
    "goerli",
    "938A5X7YPBEK15XWNBRI55X9E6EEYA619Q"
  )

  async function getAccountHistory(accountCA) {
    const history = await etherscanProvider.getHistory(accountCA)
    return history
  }

  // UseEffect

  useEffect(() => {
    checkIfWalletIsConnect()
  }, [currentAccount])

  return (
    <APIContext.Provider
      value={{
        connectWallet,
        currentAccount,
        getHistory,
        getAccountHistory,
        getWallets,
        postWallet,
        getBalance,
        deleteWallet,
      }}
    >
      {children}
    </APIContext.Provider>
  )
}
