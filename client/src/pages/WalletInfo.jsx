import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Header, TxTable } from "../components";
import { TextInput, Card, Spinner, Dropdown } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { SiBinance, SiEthereum } from "react-icons/si";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import { ReactComponent as ArbitrumLogo } from "../assets/arbitrum-logo.svg";
import { ReactComponent as OptimismLogo } from "../assets/optimism-logo.svg";

import { APIContext } from "../contexts/APIProvider";

export default function WalletInfo() {
  const { chainId, ca } = useParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [accountHistory, setAccountHistory] = useState([]);
  const [historyError, setHistoryError] = useState();
  const [fetchingHistory, setFetchingHistory] = useState(false);

  const { getHistory } = useContext(APIContext);

  function handleSubmit() {
    navigate(`/wallet-info/${chainId}/${searchValue}`);
  }

  useEffect(() => {
    if (!ca) return;
    setFetchingHistory(true);
    getHistory(ca, chainId).then((result) => {
      if (result == "ERR_BAD_REQUEST") {
        setHistoryError("Account not found.");
        setFetchingHistory(false);
        setAccountHistory([]);
        return;
      }

      if (result.length === 0) {
        setHistoryError("No transactions to show.");
        setFetchingHistory(false);
        setAccountHistory([]);
        return;
      }

      setAccountHistory(result);
      setFetchingHistory(false);
      setHistoryError(null);
    });
  }, [chainId]);

  return (
    <div className="m-2 mt-14 flex flex-col rounded-3xl bg-white p-2 md:mx-10 md:mt-4 md:p-8">
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
        <Header title="Wallet" info="View transactions of a specific wallet" />
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex md:w-2/3"
        >
          <TextInput
            className="mr-2 w-full"
            id="contractAddress"
            placeholder={ca ? ca : "Enter Contract Address"}
            required={true}
            rightIcon={fetchingHistory ? Spinner : AiOutlineSearch}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <Dropdown
            label={
              <>
                {chainId == 1 && <SiEthereum />}
                {chainId == 56 && <SiBinance />}
                {chainId == 11155111 && "Sep"}
                {chainId == 42161 && (
                  <ArbitrumLogo className="mx-1 h-5 w-5 self-center invert" />
                )}
                {chainId == 10 && (
                  <OptimismLogo className="mx-1 h-5 w-5 self-center invert" />
                )}
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
            <Dropdown.Item
              icon={SiEthereum}
              onClick={() => navigate(`/wallet-info/11155111/${searchValue}`)}
            >
              sepolia TESTNET
            </Dropdown.Item>
            <Dropdown.Item
              icon={ArbitrumLogo}
              onClick={() => navigate(`/wallet-info/42161/${searchValue}`)}
            >
              Arbitrum
            </Dropdown.Item>
            <Dropdown.Item
              icon={OptimismLogo}
              onClick={() => navigate(`/wallet-info/10/${searchValue}`)}
            >
              Optimism
            </Dropdown.Item>
          </Dropdown>
        </form>
      </div>
      <div className="flex flex-col justify-center">
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
    </div>
  );
}
