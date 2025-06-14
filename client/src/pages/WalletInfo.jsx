import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Header, TxTable } from "../components";
import { TextInput, Card, Spinner, Dropdown } from "flowbite-react";
import { SiBinance, SiEthereum } from "react-icons/si";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import { ReactComponent as ArbitrumLogo } from "../assets/arbitrum-logo.svg";
import { ReactComponent as OptimismLogo } from "../assets/optimism-logo.svg";

import { APIContext } from "../contexts/APIProvider";
import { StateContext } from "../contexts/StateProvider";
import { AiOutlineSearch } from "react-icons/ai";

export default function WalletInfo() {
  const { chainId, ca } = useParams();
  const [accountHistory, setAccountHistory] = useState([]);
  const [historyError, setHistoryError] = useState();
  const [fetchingHistory, setFetchingHistory] = useState(false);

  const { getHistory } = useContext(APIContext);
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
    <div className="flex h-auto flex-col overflow-y-hidden rounded-3xl bg-white p-2 dark:bg-secondary-dark-bg md:p-8">
      <div className="flex flex-col justify-center gap-4 md:flex-row md:items-center md:justify-between">
        <Header title="Wallet" info="View transactions of a specific wallet" />
        <SearchForm
          fetchingHistory={fetchingHistory}
          chainId={chainId}
          ca={ca}
        />
      </div>
      <div className="flex h-full flex-col items-center justify-start overflow-y-auto">
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

function SearchForm({ fetchingHistory, chainId, ca }) {
  const { currentColor } = useContext(StateContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  function handleSubmit() {
    navigate(`/wallet-info/${chainId}/${searchValue}`);
  }

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      className="flex gap-2 md:w-2/3"
    >
      <TextInput
        className="w-full"
        id="contractAddress"
        placeholder={ca ? ca : "Enter Contract Address"}
        required={true}
        addon={
          fetchingHistory ? (
            <Spinner color="gray" className="max-w-[18px] text-lg" />
          ) : (
            <AiOutlineSearch className="text-lg" />
          )
        }
        color={currentColor}
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />
      <Dropdown
        label={
          <div className="flex w-7 items-center justify-center">
            {chainId == 1 && <SiEthereum className="text-lg" />}
            {chainId == 56 && <SiBinance className="text-lg" />}
            {chainId == 11155111 && (
              <p className="flex items-center justify-center text-sm leading-3">
                S<SiEthereum className="text-lg" />
              </p>
            )}
            {chainId == 42161 && (
              <ArbitrumLogo className="h-5 w-5 self-center invert" />
            )}
            {chainId == 10 && (
              <OptimismLogo className="h-5 w-5 self-center invert" />
            )}
            {!chainId && <MdOutlineKeyboardArrowDown className="text-lg" />}
          </div>
        }
        arrowIcon={false}
        size="md"
        className=""
        color={currentColor}
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
  );
}
