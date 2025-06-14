import React, { useState, useContext } from "react";
import { Header } from "../components";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { Button, Accordion, Card } from "flowbite-react";

import { StateContext } from "../contexts/StateProvider";
import {
  bgColorVariants,
  borderColorVariants,
  textColorVariants,
} from "../../utils/colorVariance";
import { twMerge } from "tailwind-merge";

export default function TokenInfo() {
  const { currentColor } = useContext(StateContext);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("chart");
  return (
    <div className="m-2 mt-14 flex h-full flex-col gap-3 rounded-3xl bg-white p-2 dark:bg-secondary-dark-bg md:mx-10 md:mt-4 md:p-8">
      <div className="flex items-start justify-between">
        <Header title="Token info" info="" />
        <Button.Group>
          <Button
            color={tab === "info" ? currentColor : "white"}
            onClick={() => {
              setTab("info");
            }}
            className="border-1 text-black focus:outline-none focus:ring-1 dark:text-white"
          >
            <AiOutlineCopy className="mr-3 h-4 w-4" />
            Info
          </Button>
          <Button
            color={tab === "chart" ? currentColor : "white"}
            onClick={() => {
              setTab("chart");
            }}
            className="border-1 text-black focus:outline-none focus:ring-1 dark:text-white"
          >
            <AiOutlineCopy className="mr-3 h-4 w-4" />
            Chart
          </Button>
        </Button.Group>
      </div>
      {tab === "info" && (
        <Accordion flush={true}>
          <Accordion.Panel>
            <Accordion.Title>Tokenomics</Accordion.Title>
            <Accordion.Content>
              <Card>
                <div className="flex justify-around">
                  <div className="flex w-1/2 flex-col items-center justify-center">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Token Distribution
                    </h5>
                    <p className=" text-gray-700 dark:text-gray-400">
                      1,000,000,000 $WATCHER
                      <br /> 40% Burned <br /> 10% Marketing <br /> 50%
                      Liquidity
                    </p>
                  </div>
                  <div
                    className={twMerge(
                      "mx-2 w-1 rounded-lg",
                      bgColorVariants({ color: currentColor })
                    )}
                  />
                  <div className="flex w-1/2 flex-col items-center justify-center">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Tax Breakdown
                    </h5>
                    <p className=" text-gray-700 dark:text-gray-400">
                      5% <span className="text-green-600">BUY</span> | 5%{" "}
                      <span className="text-red-600">SELL</span>
                      <br />
                      1% to Liquidity pool
                      <br />
                      4% to Marketing wallet
                    </p>
                  </div>
                </div>
              </Card>
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title>Additional info</Accordion.Title>
            <Accordion.Content className="text-black dark:text-white">
              <p className="text-lg font-semibold">Contract Address:</p>
              <div className="mb-2 flex items-center gap-3">
                <p className="italic">
                  0xec4a2eC33Be08D3f366013Cf64c4774AB0E06a30
                </p>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "0xec4a2eC33Be08D3f366013Cf64c4774AB0E06a30"
                    );
                    setCopied(true);
                  }}
                >
                  {copied ? (
                    <AiOutlineCheck
                      className={twMerge(
                        "rounded-lg border-2 p-1 text-3xl hover:cursor-pointer",
                        textColorVariants({ color: currentColor }),
                        borderColorVariants({ color: currentColor })
                      )}
                    />
                  ) : (
                    <AiOutlineCopy
                      className={twMerge(
                        "rounded-lg border-2 p-1 text-3xl hover:cursor-pointer",
                        textColorVariants({ color: currentColor }),
                        borderColorVariants({ color: currentColor })
                      )}
                    />
                  )}
                </div>
              </div>
              <p className="mb-2 text-lg font-semibold">Token links:</p>
              <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    href="https://dexscreener.com/ethereum/0xed5ef2c33d589debd4845efa6944c508bd03647d"
                    className="text-blue-600 hover:underline dark:text-blue-500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    DexScreener
                  </a>
                </li>
                <li>
                  <a
                    href="https://tokensniffer.com/token/eth/abus59nab040gja5xv32e5305oz0kkx60bzk5sbsqqs9jx3ualmp8xk4p90x"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Token Sniffer
                  </a>
                </li>
              </ul>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      )}
      {tab === "chart" && (
        <iframe
          className="flex h-full w-full rounded-lg"
          src="https://dexscreener.com/ethereum/0xED5ef2c33D589debD4845eFa6944C508bd03647D?embed=1&theme=dark&trades=0&info=1"
        ></iframe>
      )}
    </div>
  );
}
