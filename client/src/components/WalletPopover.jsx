import React, { useContext, useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import { SlWallet } from "react-icons/sl";

import { SiBinance, SiEthereum } from "react-icons/si";
import { ReactComponent as ArbitrumLogo } from "../assets/arbitrum-logo.svg";
import { ReactComponent as OptimismLogo } from "../assets/optimism-logo.svg";

import { APIContext } from "../contexts/APIProvider";

import { shortenAddress } from "../../utils/shortenAddress";

export default function WalletPopover() {
  const { currentAccount, disconnectSimulatedWallet, getBalance, chainId } =
    useContext(APIContext);
  const [userBalance, setUserBalance] = useState();
  useEffect(() => {
    if (currentAccount && currentAccount.startsWith("0x"))
      getBalance(currentAccount, chainId).then(setUserBalance);
  }, [currentAccount, chainId]);

  return (
    <Dropdown
      label={
        <div className="p-3 text-xl text-white hover:drop-shadow-xl md:text-3xl rounded-full bg-purple-600 hover:bg-purple-700">
          <SlWallet />
        </div>
      }
      placement="top"
      inline={true}
      arrowIcon={false}
      className="overflow-y-auto overflow-x-hidden p-2"
    >
      <Dropdown.Header className="flex items-end flex-col">
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="text-nowrap text-sm">Connected wallet:</p>
          <p className="font-semibold">
            {currentAccount && shortenAddress(currentAccount)}
          </p>
        </div>
        {/* If the wallet is simulated, add a tag to specify it is a simulated wallet.
        The simulated wallets have 1x at the start of the address. */}
        {currentAccount && currentAccount.startsWith("1x") && (
          <p className="text-xs text-gray-500">Simulated wallet</p>
        )}
      </Dropdown.Header>
      {currentAccount &&
        (currentAccount.startsWith("1x") ? (
          <Dropdown.Item
            onClick={disconnectSimulatedWallet}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2">
              <div className="relative inline-block">
                <SlWallet className="text-xl" />
                {/* this is a hack to make the wallet icon line through */}
                <div
                  style={{
                    position: "absolute",
                    width: "2px",
                    backgroundColor: "black",
                    top: 0,
                    left: "100%",
                    height: "150%",
                    transform: "rotate(45deg)",
                    transformOrigin: "top left",
                  }}
                />
              </div>
              Disconnect wallet
            </div>
            <p className="text-xs text-red-500 text-nowrap">
              Simulated wallet will be deleted
            </p>
          </Dropdown.Item>
        ) : (
          <>
            <div className="flex flex-row justify-center items-center gap-2">
              <p className="text-nowrap text-sm">Chain connected:</p>
              <ChainNameWithIcon chainId={chainId} />
            </div>
            <div className="flex flex-row justify-center items-center">
              <p className="text-nowrap pr-2 text-sm">Wallet balance:</p>
              <ChainIcon chainId={chainId} />
              {userBalance && (
                <p className="text-nowrap pl-1">{userBalance.slice(0, 5)}</p>
              )}
            </div>
          </>
        ))}
    </Dropdown>
  );
}

function ChainIcon({ chainId }) {
  if (chainId == 1) return <SiEthereum />;
  if (chainId == 56) return <SiBinance />;
  if (chainId == 11155111)
    return (
      <div className="flex flex-row items-center">
        <p>Sep</p>
        <SiEthereum />
      </div>
    );
  if (chainId == 42161) return <ArbitrumLogo className="h-5 w-5" />;
  if (chainId == 10) return <OptimismLogo className="h-5 w-5" />;
  else return <p>Unknown</p>;
}

function ChainNameWithIcon({ chainId }) {
  return (
    <div className="flex flex-row items-center gap-1">
      <ChainIcon chainId={chainId} />
      {chainId == 1 && <p>Ethereum</p>}
      {chainId == 56 && <p>Binance</p>}
      {chainId == 42161 && <p>Arbitrum</p>}
      {chainId == 10 && <p>Optimism</p>}
    </div>
  );
}

function BalanceWithIcon({ chainId, balance }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <ChainIcon chainId={chainId} />
      {balance && <p className="text-nowrap pl-1">{balance.slice(0, 5)}</p>}
    </div>
  );
}
