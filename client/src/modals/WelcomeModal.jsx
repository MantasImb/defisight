import React from "react";
import ReactDOM from "react-dom";

import { Button } from "flowbite-react";
import image from "../assets/welcome.png";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { GrTest } from "react-icons/gr";

function WelcomeModal({ isOpen, connect, simulateRandomWallet }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-20 top-0 left-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 md:gap-4 overflow-hidden rounded-md border border-purple-700 bg-white shadow-lg w-4/5 lg:w-1/2">
        <img src={image} />
        <h1 className="text-xl sm:text-2xl font-bold text-center px-2">
          Welcome to the ChainWatcher!
        </h1>
        <div className="flex flex-col text-center gap-2 px-2 md:px-4">
          <p className="text-gray-500">
            ChainWatcher is a work-in-progress, constantly striving to bring you
            the best tools for monitoring and profiting from the ICO's of the
            crypto world.
          </p>
          <div className="w-full h-[1px] bg-gray-500 my-2" />
          <p className="text-gray-500">
            The project, as of now, is sunset and is used as a showcase for my
            personal portfolio -{" "}
            <a
              className="text-purple-600 underline"
              href="https://www.mantas.im"
            >
              Mantas.im
            </a>
            .
          </p>
          <p className="text-gray-500">
            Feel free to press the "Simulate Wallet" button to get a local
            wallet, add a testing wallet to your tracked wallets, and press the
            <div className="inline-block mx-1 -mb-1 p-1 rounded-full bg-purple-600">
              <GrTest className="text-white" />
            </div>
            button to simulate a transaction.
          </p>
        </div>
        <div className="flex w-full justify-center gap-4 px-2 pb-2 md:pb-4">
          <Button onClick={connect} size="md" color="purple">
            Connect Wallet
          </Button>
          <Button onClick={simulateRandomWallet} size="md" color="purple">
            Simulate Wallet
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default WelcomeModal;
