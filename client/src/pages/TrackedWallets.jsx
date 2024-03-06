// TODO: Add styling for dark mode

import { Button } from "flowbite-react";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { BiBookAdd } from "react-icons/bi";
import { Header, WalletsTable } from "../components";
import NewWalletModal from "../modals/NewWalletModal";

// import { toast } from "react-toastify";

import { StateContext } from "../contexts/StateProvider";
import { APIContext } from "../contexts/APIProvider";

export default function TrackedWallets() {
  const { currentAccount, getWallets, postWallet, devWallets } =
    useContext(APIContext);
  const { setToastState } = useContext(StateContext);
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
    <div className="m-2 mt-14 flex flex-col rounded-3xl bg-white p-2 md:mx-10 md:mt-4 md:p-8">
      <div className="flex flex-col justify-center md:flex-row md:justify-between">
        <Header category="Tables" title="Tracked Wallets" />
        <div className="flex flex-row">
          <Button
            className="mr-2 self-center bg-[#ff9922] hover:bg-[#ff9700]"
            onClick={() => {
              if (!currentAccount)
                return setToastState({
                  message: "Please connect your wallet to add a new address",
                  type: "error",
                });
              setFormIsOpen(true);
            }}
            color={"primary"}
            size="md"
          >
            <BiBookAdd className="mr-2 text-lg" />
            Add new address
          </Button>
          {/* <button onClick={() => console.log(wallets)}>a</button> */}
        </div>
      </div>

      {/* TABLE */}
      <div className="h-4/6 overflow-x-scroll md:flex md:justify-center">
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
