import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HiCheck, HiX } from "react-icons/hi";

import { Navbar, Sidebar, WalletPopover, TestingButton } from "./components";
import {
  TrackedWallets,
  WalletInfo,
  LiveTransactions,
  TokenInfo,
} from "./pages";
import WelcomeModal from "./modals/WelcomeModal";

import { Toast } from "flowbite-react";

import { StateContext } from "./contexts/StateProvider";
import { APIContext } from "./contexts/APIProvider";

import "./App.css";

export default function App() {
  const { activeMenu, currentMode, toastState, setToastState } =
    useContext(StateContext);

  const { currentAccount, connectWallet, simulateRandomWallet } =
    useContext(APIContext);

  useEffect(() => {
    if (currentAccount) {
      setToastState({
        message: "Wallet connected successfully.",
        type: "success",
      });
    } else {
      setToastState({
        message: "Wallet is not connected.",
        type: "error",
      });
    }
  }, [currentAccount]);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <WelcomeModal
        isOpen={currentAccount == null}
        connect={connectWallet}
        simulateRandomWallet={simulateRandomWallet}
      />
      {toastState.message.length > 0 && (
        <Toast className="fixed top-5 right-5 z-50 animate-toastIn">
          {toastState.type == "success" ? (
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
          ) : (
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <HiX className="h-5 w-5" />
            </div>
          )}
          <div className="ml-3 text-sm font-normal">{toastState.message}</div>
          <Toast.Toggle />
        </Toast>
      )}
      <BrowserRouter>
        <div className="relative flex overflow-hidden dark:bg-main-dark-bg">
          <div
            className="fixed flex gap-2 right-4 bottom-4"
            style={{ zIndex: "2" }}
          >
            <TestingButton />
            <WalletPopover />
          </div>
          {activeMenu ? (
            <div className="z-10 fixed w-72 bg-white dark:bg-secondary-dark-bg ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={`flex h-screen w-full flex-col bg-main-bg dark:bg-main-dark-bg ${
              activeMenu ? "md:ml-72" : "flex-2"
            }`}
          >
            <div className="fixed z-10 w-full bg-main-bg dark:bg-main-dark-bg md:static">
              <Navbar />
            </div>
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={<TrackedWallets />} />

              {/* Pages */}

              <Route path="/token-info" element={<TokenInfo />} />
              <Route path="/tracked-wallets" element={<TrackedWallets />} />
              <Route path="/live-transactions" element={<LiveTransactions />} />

              {/* Apps */}

              {/* Charts */}
              <Route path="/wallet-info" element={<WalletInfo />} />
              <Route path="/wallet-info/:chainId" element={<WalletInfo />} />
              <Route
                path="/wallet-info/:chainId/:ca"
                element={<WalletInfo />}
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}
