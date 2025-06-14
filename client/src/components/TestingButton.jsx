import React, { useContext, useState, useEffect } from "react";
import { Spinner, Tooltip } from "flowbite-react";
import { ReactComponent as GrTest } from "../assets/grTestIcon.svg";

import { APIContext } from "../contexts/APIProvider";
import { StateContext } from "../contexts/StateProvider";
import { twMerge } from "tailwind-merge";
import { bgColorVariants } from "../../utils/colorVariance";

export default function TestingButton() {
  const { simulateSepoliaTransaction } = useContext(APIContext);
  const { setToastState, currentColor } = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    await simulateSepoliaTransaction();
    setIsLoading(false);
    setIsCompleted(true);
  }

  useEffect(() => {
    if (isCompleted) {
      setToastState({
        message:
          "Sepolia transaction simulated successfully. It will be indexed on the blockchain in up to a minute.",
        type: "success",
      });
    }
  }, [isCompleted]);

  return (
    <Tooltip
      content="Simulate Sepolia transaction"
      disabled={isLoading}
      className="overflow-x-hidden overflow-y-hidden p-2"
    >
      <div
        onClick={handleClick}
        className={twMerge(
          bgColorVariants({ color: currentColor }),
          "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full p-3 hover:drop-shadow-xl md:h-14 md:w-14"
        )}
      >
        {isLoading ? (
          <Spinner
            light
            color="gray"
            className="text-xl text-white md:text-3xl"
          />
        ) : (
          <GrTest className="text-xl text-white md:text-3xl" />
        )}
      </div>
    </Tooltip>
  );
}
