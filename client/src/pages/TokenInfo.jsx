import React, { useState } from "react";
import { Header } from "../components";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";

export default function TrackedWallets() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="m-2 mt-14 flex flex-col items-center justify-center gap-3 rounded-3xl bg-white p-2 md:mx-10 md:mt-4 md:p-8">
      <Header category="" title="Token info" />

      <p className="text-xl font-bold">WE ARE LIVE!</p>
      <a
        href="https://dexscreener.com/ethereum/0xed5ef2c33d589debd4845efa6944c508bd03647d"
        className="text-lg text-purple-600"
      >
        Our token is <span className="italic">LIVE.</span>{" "}
        <span className=" underline underline-offset-1">
          Click here to be redirected.
        </span>
      </a>
      <div className="flex items-center justify-center gap-3">
        <p className="animate-pulse text-lg italic text-black">
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
          {" "}
          {copied ? (
            <AiOutlineCheck className="rounded-lg border-2 border-purple-600 p-1 text-3xl text-purple-600 hover:cursor-pointer" />
          ) : (
            <AiOutlineCopy className="rounded-lg border-2 border-purple-600 p-1 text-3xl text-purple-600 hover:cursor-pointer" />
          )}
        </div>
      </div>
      <p className="text-lg">More info comming soon!</p>
    </div>
  );
}
