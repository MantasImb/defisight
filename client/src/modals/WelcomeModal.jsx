import React from "react";
import ReactDOM from "react-dom";

import { Button } from "flowbite-react";
import image from "../assets/welcome.png";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";

function WelcomeModal({ isOpen, connect, simulateWallet }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div className="fixed inset-0 z-10 h-full w-full animate-fadeIn overflow-y-auto bg-gray-600 bg-opacity-50"></div>
      {/* content */}
      <div className="fixed top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 animate-fadeIn flex-col overflow-hidden rounded-md border border-purple-700 bg-white shadow-lg">
        {/* put content of the modal in this div below */}
        <img src={image} />
        <div className="m-2 p-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to the ChainWatcher!</h1>
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
        </div>
        <div className="flex w-full justify-center">
          <Button
            onClick={connect}
            size="md"
            color="purple"
            className="mx-5 mb-5"
          >
            Connect Wallet
          </Button>
          <Button
            onClick={simulateWallet}
            size="md"
            color="purple"
            className="mx-5 mb-5"
          >
            Simulate Wallet
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}

export default WelcomeModal;
