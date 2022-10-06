import React, { useContext } from "react"
import { APIContext } from "../APIContext"
import { shortenAddress } from "../../utils/shortenAddress"

export default function Menu() {
  const { currentAccount, connectWallet } = useContext(APIContext)
  return (
    <div className="flex flex-col justify-between align-center border-2 py-2">
      <div className="border-2 rounded-md">
        <h1 className="text-lg font-bold p-2 text-center">BLOCKSIGHT</h1>
      </div>
      <div className="border-2 rounded-md p-2 text-center">
        {!currentAccount ? (
          <button
            onClick={() => {
              connectWallet()
            }}
          >
            Connect
          </button>
        ) : (
          <h1>{shortenAddress(currentAccount)}</h1>
        )}
      </div>
    </div>
  )
}
