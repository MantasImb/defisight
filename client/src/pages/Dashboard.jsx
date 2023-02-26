import React, { useContext } from "react";

import { Button } from "../components";

import { StateContext } from "../contexts/StateProvider";

export default function Dashboard() {
  const { currentColor } = useContext(StateContext);
  return (
    <div className="mt-24">
      <div className="m-3 rounded-2xl bg-white p-4 dark:bg-secondary-dark-bg dark:text-gray-200 md:w-780">
        <TxFeed />
      </div>
    </div>
  );
}
