// TODO: Add styling for dark mode

import { Button } from "flowbite-react";
import React, { useContext, useState, useEffect } from "react";
import { BiBookAdd } from "react-icons/bi";
import { Header, WalletsTable } from "../components";
import NewWalletModal from "../modals/NewWalletModal";

import { StateContext } from "../contexts/StateProvider";
import { APIContext } from "../contexts/APIProvider";

export default function TrackedWallets() {
  const { currentAccount, getWallets, postWallet, devWallets } =
    useContext(APIContext);
  const { setToastState, currentColor } = useContext(StateContext);
  const [formIsOpen, setFormIsOpen] = useState(false);

  const [wallets, setWallets] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (fetching) return;
    if (!currentAccount) return;
    setFetching(true);
    getWallets().then((res) => setWallets(res));
  }, [currentAccount]);

  // function to add a wallet to the table
  async function addWallet(wallet) {
    let { data } = await postWallet(wallet);
    setWallets((prev) => [
      ...prev,
      {
        ...data,
        id: data._id,
      },
    ]);
    setFormIsOpen(false);
  }

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-3xl bg-white p-2 dark:bg-secondary-dark-bg md:p-8">
      <div className="flex flex-col justify-center md:flex-row md:justify-between">
        <Header
          title="Tracked Wallets"
          info="Add wallets to track their activity"
        />
        <div className="flex flex-row">
          <Button
            className="mr-2 self-center"
            onClick={() => {
              if (!currentAccount)
                return setToastState({
                  message: "Please connect your wallet to add a new address",
                  type: "error",
                });
              setFormIsOpen(true);
            }}
            color={currentColor}
            size="md"
          >
            <BiBookAdd className="mr-2 text-lg" />
            Add new address
          </Button>
          {/* <button onClick={() => console.log(wallets)}>a</button> */}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-auto md:flex md:justify-center">
        {wallets.length > 0 && (
          <WalletsTable data={wallets} setData={setWallets} />
        )}
      </div>

      {/* FORM */}
      <NewWalletModal
        isOpen={formIsOpen}
        onClose={() => setFormIsOpen(false)}
        setClose={setFormIsOpen}
        onSubmit={addWallet}
        isDev={devWallets.includes(currentAccount)}
      ></NewWalletModal>
    </div>
  );
}
