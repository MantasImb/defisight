// TODO: Work with local storage to save the theme settings

import React, { createContext, useState, useEffect } from "react";

export const StateContext = createContext();

export function StateProvider({ children }) {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState(
    localStorage.getItem("themeColor") || "purple"
  );
  const [currentMode, setCurrentMode] = useState(
    localStorage.getItem("themeMode") || "Light"
  );
  const [themeSettings, setThemeSettings] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toastState, setToastState] = useState({
    message: "",
    type: "",
  });
  const [toastAwaitingReset, setToastAwaitingReset] = useState(false);

  function setMode(mode) {
    setCurrentMode(mode);
    localStorage.setItem("themeMode", mode);
  }

  function setColor(arg) {
    setCurrentColor(arg);
    localStorage.setItem("themeColor", arg);
  }

  useEffect(() => {
    if (toastAwaitingReset) return;
    if (toastState.message.length > 0 && !toastAwaitingReset) {
      setToastAwaitingReset(true);
      setTimeout(() => {
        setToastState({ message: "", type: "" });
        setToastAwaitingReset(false);
      }, 1000 * 5);
    }
  }, [toastState]);

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        notificationsOpen,
        setNotificationsOpen,
        screenSize,
        setScreenSize,
        currentColor,
        currentMode,
        setColor,
        setMode,
        themeSettings,
        setThemeSettings,
        toastState,
        setToastState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
