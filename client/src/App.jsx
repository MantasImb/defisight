// TODO: Make a dashboard page

import React, { useContext, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SlWallet } from "react-icons/sl"
import { HiCheck, HiX } from "react-icons/hi"

import { Navbar, Sidebar, ThemeSettings } from "./components"
import { Dashboard, TrackedWallets, WalletInfo } from "./pages"
import { Toast } from "flowbite-react"

import { StateContext } from "./contexts/StateProvider"
import { APIContext } from "./contexts/APIProvider"

import "./App.css"

export default function App() {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
    toastState,
    setToastState,
  } = useContext(StateContext)

  const { currentAccount, connectWallet } = useContext(APIContext)

  useEffect(() => {
    if (currentAccount) {
      setToastState({
        message: "Wallet connected successfully.",
        type: "success",
      })
    } else {
      setToastState({
        message: "Wallet is not connected.",
        type: "error",
      })
    }
  }, [currentAccount])

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
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
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <button
              type="button"
              className="text-xl md:text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
              style={{
                background: currentAccount ? currentColor : "red",
                borderRadius: "50%",
              }}
              onClick={() => {
                if (!currentAccount) connectWallet()
                else setThemeSettings(true)
              }}
            >
              <SlWallet />
            </button>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={`flex flex-col h-screen dark:bg-main-dark-bg bg-main-bg w-full ${
              activeMenu ? "md:ml-72" : "flex-2"
            }`}
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>

            {/* {themeSettings && <ThemeSettings />} */}
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Pages */}

              <Route path="/tracked-wallets" element={<TrackedWallets />} />

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
  )
}
