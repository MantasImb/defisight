import React, { useContext } from "react";
import ReactDOM from "react-dom";

import { Button } from "flowbite-react";
import purpleImage from "../assets/welcomePurple.png";
import greenImage from "../assets/welcomeGreen.png";
import redImage from "../assets/welcomeRed.png";
import yellowImage from "../assets/welcomeYellow.png";
import { ReactComponent as GrTest } from "../assets/grTestIcon.svg";
import { twMerge } from "tailwind-merge";
import {
  bgColorVariants,
  borderColorVariants,
  textColorVariants,
} from "../../utils/colorVariance";
import { StateContext } from "../contexts/StateProvider";

function WelcomeModal({ isOpen, connect, simulateRandomWallet }) {
  if (!isOpen) return null;
  const { currentColor, currentMode } = useContext(StateContext);

  return ReactDOM.createPortal(
    <div
      className={twMerge(
        "fixed inset-0 left-0 top-0 z-20 flex h-full w-full items-center justify-center overflow-y-auto bg-black/50",
        currentMode === "Dark" && "dark"
      )}
    >
      <div
        className={twMerge(
          borderColorVariants({ color: currentColor }),
          "flex w-4/5 flex-col items-center justify-center gap-2 overflow-hidden rounded-md border bg-white shadow-lg dark:bg-secondary-dark-bg md:gap-4 lg:w-1/2"
        )}
      >
        {currentColor === "purple" && <img src={purpleImage} />}
        {currentColor === "red" && <img src={redImage} />}
        {currentColor === "green" && <img src={greenImage} />}
        {currentColor === "yellow" && <img src={yellowImage} />}
        <h1 className="px-2 text-center text-xl font-bold dark:text-gray-200 sm:text-2xl">
          Welcome to the ChainWatcher!
        </h1>
        <div className="flex flex-col gap-2 px-2 text-center text-gray-500 dark:text-white md:px-4">
          <p>
            ChainWatcher is a work-in-progress, constantly striving to bring you
            the best tools for monitoring and profiting from the ICO&#39;s of
            the crypto world.
          </p>
          <div className="my-2 h-[1px] w-full bg-gray-500" />
          <p>
            The project, as of now, is sunset and is used as a showcase for my
            personal portfolio -{" "}
            <a
              className={twMerge(
                textColorVariants({ color: currentColor }),
                "underline"
              )}
              href="https://www.mantas.im"
            >
              Mantas.im
            </a>
            .
          </p>
          <p>
            Feel free to simulate a new wallet, add a testing wallet to your
            tracked wallets, and press the
            <span
              className={twMerge(
                bgColorVariants({ color: currentColor }),
                "mx-1 -mb-1 inline-block rounded-full p-1"
              )}
            >
              <GrTest className="text-white" />
            </span>
            button to simulate a transaction. Give it a few moments and you
            should see a notification.
          </p>
        </div>
        <div className="flex w-full justify-center gap-4 px-2 pb-2 md:pb-4">
          <Button onClick={connect} size="md" color={currentColor}>
            Connect Wallet
          </Button>
          <Button onClick={simulateRandomWallet} size="md" color={currentColor}>
            Simulate Wallet
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default WelcomeModal;
