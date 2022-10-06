import React from "react"

import { useContext } from "react"
import { APIContext } from "../APIContext"

export default function Tracker() {
  const { currentAccount, history } = useContext(APIContext)
  return (
    <>
      <div className="flex h-4/5">
        <div className="overflow-y-scroll">
          {history.length ? (
            history.map((tx) => <p>{tx.hash}</p>)
          ) : (
            <h1>Nothing to show</h1>
          )}
        </div>
      </div>
    </>
  )
}
