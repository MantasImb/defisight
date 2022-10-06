import React from "react"

import { useContext } from "react"
import { EthereumContext } from "../EthereumContext"

export default function Tracker() {
  const { currentAccount } = useContext(EthereumContext)
  return <></>
}
