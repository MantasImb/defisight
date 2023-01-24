import React, { useState, useContext, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { Header, TxTable } from "../components"
import { TextInput, Card, Spinner, Dropdown } from "flowbite-react"
import { AiOutlineSearch } from "react-icons/ai"
import { SiBinance, SiEthereum } from "react-icons/si"
import { MdOutlineKeyboardArrowDown } from "react-icons/md"

import { APIContext } from "../contexts/APIProvider"
import { StateContext } from "../contexts/StateProvider"

export default function WalletInfo() {
  const { chainId, ca } = useParams()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [accountHistory, setAccountHistory] = useState([])
  const [historyError, setHistoryError] = useState()
  const [fetchingHistory, setFetchingHistory] = useState(false)

  const { getHistory, currentAccount, devWallets } = useContext(APIContext)
  const { screenSize } = useContext(StateContext)

  function handleSubmit(e) {
    navigate(`/wallet-info/${chainId}/${searchValue}`)
  }

  useEffect(() => {
    if (!ca) return
    setFetchingHistory(true)
    getHistory(ca, chainId).then((result) => {
      if (result == "ERR_BAD_REQUEST") {
        setHistoryError("Account not found.")
        setFetchingHistory(false)
        setAccountHistory([])
        return
      }

      if (result.length === 0) {
        setHistoryError("No transactions to show.")
        setFetchingHistory(false)
        setAccountHistory([])
        return
      }

      setAccountHistory(result)
      setFetchingHistory(false)
      setHistoryError(null)
    })
  }, [chainId])

  return (
    <div className="flex flex-col m-2 md:mx-10 mt-14 md:mt-4 p-2 md:p-8 bg-white rounded-3xl">
      <div className="flex justify-center items-center md:justify-between flex-col md:flex-row">
        <Header category="Info" title="Wallet" />
        <form
          onSubmit={(e) => {
            handleSubmit(e)
          }}
          className="flex md:w-2/3"
        >
          <TextInput
            className="mr-2 w-full"
            id="contractAddress"
            placeholder={ca ? ca : "Enter Contract Address"}
            required={true}
            icon={fetchingHistory ? Spinner : AiOutlineSearch}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <Dropdown
            label={
              <>
                {chainId == 1 && <SiEthereum />}
                {chainId == 56 && <SiBinance />}
                {chainId == 5 && "GT"}
                {!chainId && <MdOutlineKeyboardArrowDown />}
              </>
            }
            arrowIcon={false}
            size="lg"
            className=""
            color="purple"
          >
            <Dropdown.Item
              icon={SiEthereum}
              onClick={() => navigate(`/wallet-info/1/${searchValue}`)}
            >
              Ethereum Mainnet
            </Dropdown.Item>
            <Dropdown.Item
              icon={SiBinance}
              onClick={() => navigate(`/wallet-info/56/${searchValue}`)}
            >
              Binance Smart Chain
            </Dropdown.Item>
            {devWallets.includes(currentAccount) && (
              <Dropdown.Item
                icon={SiEthereum}
                onClick={() => navigate(`/wallet-info/5/${searchValue}`)}
              >
                Goerli TESTNET
              </Dropdown.Item>
            )}
          </Dropdown>
        </form>
      </div>
      <div className="flex justify-center flex-col">
        {accountHistory.length > 0 && (
          <TxTable data={accountHistory} chainId={chainId} />
        )}
        {historyError && (
          <Card>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {historyError}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Try searching for another address.
            </p>
          </Card>
        )}
      </div>
      {/* <button onClick={() => console.log(accountHistory)}>OK</button> */}
    </div>
  )
}
