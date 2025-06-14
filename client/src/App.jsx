import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HiCheck, HiX } from "react-icons/hi";

import {
  Navbar,
  Sidebar,
  WalletPopover,
  TestingButton,
  CustomizationButton,
  ThemeSidebar,
} from "./components";
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
import { FaAngleRight } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { bgColorVariants } from "../utils/colorVariance";

export default function App() {
  const {
    activeMenu,
    currentMode,
    toastState,
    setThemeSettings,
    themeSettings,
    setToastState,
    currentColor,
  } = useContext(StateContext);

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
        <Toast className="fixed right-5 top-5 z-50 animate-toastIn">
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
        <div className="relative flex h-screen overflow-hidden dark:bg-main-dark-bg">
          <div
            className="fixed bottom-4 right-4 flex gap-2"
            style={{ zIndex: "2" }}
          >
            <CustomizationButton />
            <TestingButton />
            <WalletPopover />
          </div>
          {activeMenu ? (
            <div className="fixed z-10 w-72 bg-white dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          {themeSettings && (
            <div className="fixed right-0 z-20 flex w-11/12 md:w-96">
              <button
                type="button"
                className={twMerge(
                  bgColorVariants({ color: currentColor }),
                  "flex size-12 h-11 w-11 cursor-pointer items-center justify-center self-center rounded-full p-3 text-xl hover:drop-shadow-xl md:h-14 md:w-14"
                )}
                onClick={() => setThemeSettings((prevValue) => !prevValue)}
              >
                <FaAngleRight className="text-3xl text-white" />
              </button>
              <ThemeSidebar />
            </div>
          )}
          <div
            className={twMerge(
              "flex h-full w-full flex-col overflow-y-auto bg-main-bg px-10 py-2 dark:bg-main-dark-bg",
              activeMenu ? "md:ml-72" : "flex-2"
            )}
          >
            <div className="static w-full bg-main-bg dark:bg-main-dark-bg">
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
      {/* filler classes to import tailwind styles for use in cva */}
      <div className="h-0 border-red-600 bg-red-600 text-red-600 hover:border-red-700 hover:bg-red-700 hover:text-red-700" />
      <div className="h-0 border-green-600 bg-green-600 text-green-600 hover:border-green-700 hover:bg-green-700 hover:text-green-700" />
      <div className="h-0 border-yellow-600 bg-yellow-600 text-yellow-600 hover:border-yellow-700 hover:bg-yellow-700 hover:text-yellow-700" />
      <div className="h-0 border-purple-600 bg-purple-600 text-purple-600 hover:border-purple-700 hover:bg-purple-700 hover:text-purple-700" />
    </div>
  );
}
