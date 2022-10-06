import React, { useContext } from "react"
import { EthereumContext } from "../EthereumContext"

export default function Header() {
  const { currentAccount, connectWallet } = useContext(EthereumContext)
  return (
    <>
      {!currentAccount ? (
        <button
          onClick={() => {
            connectWallet()
          }}
        >
          Connect
        </button>
      ) : (
        <h1>{currentAccount}</h1>
      )}
    </>
  )
}
