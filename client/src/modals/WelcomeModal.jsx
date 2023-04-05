import React from "react";
import ReactDOM from "react-dom";

import { Button } from "flowbite-react";
import image from "../assets/welcome.png";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";

function WelcomeModal({ isOpen, connect }) {
  if (!isOpen) return null;

  const [copied, setCopied] = React.useState(false);

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div className="fixed inset-0 z-10 h-full w-full animate-fadeIn overflow-y-auto bg-gray-600 bg-opacity-50"></div>
      {/* content */}
      <div className="fixed top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 animate-fadeIn flex-col overflow-hidden rounded-md border border-purple-700 bg-white shadow-lg">
        {/* put content of the modal in this div below */}
        <img src={image} />
        <div className="m-2 p-2 text-center">
          <h1 className="text-2xl font-bold">
            Welcome to the ChainWatcher.app!
          </h1>
          <p className="text-gray-500">
            Join us on the cutting edge of blockchain technology as we
            continuously evolve and improve our platform.
          </p>
          <p className="text-gray-500">
            ChainWatcher is a work-in-progress, constantly striving to bring you
            the best tools for monitoring and profiting from the ICO's of the
            crypto world.
          </p>
          <p className="text-gray-500">
            Connect your wallet and start your journey towards the future of
            finance.
          </p>
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
        </div>

        <Button
          onClick={connect}
          size="md"
          color="purple"
          className="mx-5 mb-5"
        >
          Connect Wallet
        </Button>
      </div>
    </>,
    document.getElementById("portal")
  );
}

export default WelcomeModal;
