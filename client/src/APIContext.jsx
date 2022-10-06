import React, { useState, useEffect } from "react"
import axios from "axios"

export const APIContext = React.createContext()

const url = "http://localhost:4000/"
const { ethereum } = window

export default function APIProvider({ children }) {
  // ETHEREUM

  const [currentAccount, setCurrentAccount] = useState("")
  const [chainId, setChainId] = useState()

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

  // SERVER API

  const [history, setHistory] = useState([])

  async function getHistory() {
    let response = await axios.get(
      `${url}history/${currentAccount}/${"0xFF05c2Bc8461622359F33dbea618bb028D943eCE"}/${chainId}`
    )
    let { data } = response
    console.log(`Fetched ${data.length} transactions`)
    setHistory(data)
  }

  // UseEffect

  useEffect(() => {
    checkIfWalletIsConnect()
    if (currentAccount) {
      getHistory()
    }
  }, [currentAccount])

  return (
    <APIContext.Provider value={{ connectWallet, currentAccount, history }}>
      {children}
    </APIContext.Provider>
  )
}
