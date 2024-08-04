import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import io from "socket.io-client";

export const APIContext = React.createContext();

const devWallets = [
  "0xff05c2bc8461622359f33dbea618bb028d943ece",
  "0xfdb4640119f214ab6ce6fc145897378a1e6a6f20",
  "0xe88edd63010b5d0b1393ad772f19e282687cbef8",
];

// const url = "https://server.chainwatcher.app/";
const url = "http://localhost:4000/";

const socket = io(url);
const { ethereum } = window;

export default function APIProvider({ children }) {
  // ETHEREUM

  const [currentAccount, setCurrentAccount] = useState();
  const [chainId, setChainId] = useState();
  const [notifications, setNotifications] = useState([]);
  const [unseenNotifications, setUnseenNotifications] = useState(0);

  const mainnetProvider = ethers.getDefaultProvider("https://rpc.ankr.com/eth");
  const bscProvider = ethers.getDefaultProvider(
    "https://bsc-dataseed.binance.org/"
  );
  const sepoliaProvider = ethers.getDefaultProvider(
    "https://ethereum-sepolia-rpc.publicnode.com"
  );
  const optimismProvider = ethers.getDefaultProvider(
    "https://mainnet.optimism.io"
  );
  const arbitrumProvider = ethers.getDefaultProvider(
    "https://arb1.arbitrum.io/rpc"
  );

  async function checkIfWalletIsConnect() {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      setChainId(window.ethereum.networkVersion);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function connectWallet() {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      setChainId(window.ethereum.networkVersion);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  }

  async function getBalance(walletCA, chainId) {
    let provider;
    if (chainId == 1) provider = mainnetProvider;
    if (chainId == 56) provider = bscProvider;
    if (chainId == 11155111) provider = sepoliaProvider;
    if (chainId == 10) provider = optimismProvider;
    if (chainId == 42161) provider = arbitrumProvider;
    try {
      let balance = await provider.getBalance(walletCA);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // SIMULATION FUNCTIONS

  async function simulateRandomWallet() {
    // read from local storage if wallet exists
    let localAccount = localStorage.getItem("localAccount");
    console.log(localStorage);

    // if the user already has a wallet in local storage, use that
    if (localAccount) {
      setCurrentAccount(localAccount);
      return;
    }

    // if the user doesn't have a wallet in local storage, generate a new one
    let newAccount = "1x" + Math.floor(Math.random() * 1_000_000_000);
    setCurrentAccount(newAccount);

    // save to local storage
    localStorage.setItem("localAccount", newAccount);
  }

  function disconnectSimulatedWallet() {
    setCurrentAccount(null);
    setChainId(null);
    localStorage.removeItem("localAccount");
  }

  async function simulateSepoliaTransaction() {
    try {
      let response = await axios.get(`${url}test`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // SERVER API

  async function getHistory(accountCA, chainId) {
    // if (!currentAccount) return
    try {
      let response = await axios.get(`${url}history`, {
        params: {
          trackedCA: accountCA,
          chainId,
        },
      });
      let { data } = response;
      console.log(`Fetched ${data.length} transactions`);
      return data;
    } catch (error) {
      console.log(error);
      return error.code;
    }
  }

  async function getWallets() {
    try {
      let response = await axios.get(`${url}trackedwallets`, {
        params: {
          userCA: currentAccount,
        },
      });
      // console.log(response)
      let { data } = response;
      // console.log(data)
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function postWallet({ tag, address, chainId, highlight }) {
    try {
      address = address.toLowerCase();
      let response = await axios.post(`${url}trackedwallets`, {
        currentAccount,
        tag,
        address,
        chainId,
        highlight,
      });
      if (response) return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteWallet(id) {
    try {
      let response = await axios.delete(`${url}trackedwallets`, {
        params: {
          userCA: currentAccount,
          id,
        },
      });
      if (response) return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // function to mark a notification, or notifications as seen
  async function markNotificationAsSeen(id) {
    try {
      socket.emit("notificationSeen", id);
      setUnseenNotifications((unseenNotifications) => unseenNotifications - 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function markAllNotificationsAsSeen() {
    try {
      socket.emit("notificationsSeenAll", currentAccount);
      setUnseenNotifications(0);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAllNotifications() {
    try {
      socket.emit("notificationsDeleteAll", currentAccount);
      setNotifications([]);
    } catch (error) {
      console.log(error);
    }
  }

  // ETHERSCAN API (not used)

  const etherscanProvider = new ethers.providers.EtherscanProvider(
    "sepolia",
    "938A5X7YPBEK15XWNBRI55X9E6EEYA619Q"
  );

  async function getAccountHistory(accountCA) {
    const history = await etherscanProvider.getHistory(accountCA);
    return history;
  }

  // Desktop Notifications

  function showNotification(notification) {
    new Notification("ChainWatcher.app", {
      body: `Transaction detected on ${notification.tag}`,
    });
  }

  function handleDesktopNotification(notification) {
    if (Notification.permission === "granted") {
      showNotification(notification);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showNotification(notification);
        }
      });
    }
  }
  // UseEffect

  useEffect(() => {
    checkIfWalletIsConnect();
    if (!currentAccount) return;
    socket.emit("validate", currentAccount);
  }, [currentAccount]);

  useEffect(() => {
    socket.on("notification", (data) => {
      console.log(data);
      setNotifications((notifications) => [data, ...notifications]);
      setUnseenNotifications((unseenNotifications) => unseenNotifications + 1);
      handleDesktopNotification(data);
    });
    return () => {
      socket.off("notification");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("notifications", (data) => {
      console.log(data);
      setNotifications(data);
      let unseen = 0;
      data.forEach((notification) => {
        if (!notification.seen) {
          unseen++;
        }
      });
      setUnseenNotifications(unseen);
    });
    return () => {
      socket.off("notifications");
    };
  }, [socket]);

  return (
    <APIContext.Provider
      value={{
        connectWallet,
        disconnectSimulatedWallet,
        simulateRandomWallet,
        simulateSepoliaTransaction,
        currentAccount,
        chainId,
        getHistory,
        getAccountHistory,
        getWallets,
        postWallet,
        getBalance,
        deleteWallet,
        notifications,
        setNotifications,
        unseenNotifications,
        markNotificationAsSeen,
        markAllNotificationsAsSeen,
        deleteAllNotifications,
        devWallets,
      }}
    >
      {children}
    </APIContext.Provider>
  );
}
