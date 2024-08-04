import React, { useContext, useState, useEffect } from "react";
import { Dropdown, Spinner, Tooltip } from "flowbite-react";
import { GrTest } from "react-icons/gr";

import { APIContext } from "../contexts/APIProvider";
import { StateContext } from "../contexts/StateProvider";

export default function TestingButton() {
  const { simulateSepoliaTransaction } = useContext(APIContext);
  const { setToastState } = useContext(StateContext);
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
      className="overflow-y-hidden overflow-x-hidden p-2"
    >
      <div
        onClick={handleClick}
        className="p-3 hover:drop-shadow-xl rounded-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
      >
        {isLoading ? (
          <Spinner color="purple" />
        ) : (
          <GrTest className=" text-white text-xl md:text-3xl " />
        )}
      </div>
    </Tooltip>
  );
}
