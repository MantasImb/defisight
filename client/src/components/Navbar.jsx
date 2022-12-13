// TODO: create the websocket for the notifications.

import React, { useEffect, useContext } from "react"
import { AiOutlineMenu } from "react-icons/ai"
import { FiShoppingCart } from "react-icons/fi"
import { MdKeyboardArrowDown } from "react-icons/md"
import { RiNotification3Line } from "react-icons/ri"

import { Notification } from "."

import { StateContext } from "../contexts/StateProvider"

function NavButton({ title, customFunc, icon, color, dotColor }) {
  return (
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  )
}

export default function Navbar() {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
    currentColor,
  } = useContext(StateContext)

  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)

    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false)
    } else {
      setActiveMenu(true)
    }
  }, [screenSize])
  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevValue) => !prevValue)}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        {/* <NavButton
          title="Notification"
          dotColor="#03C9D7"
          customFunc={() => handleClick("notification")}
          color={currentColor}
          icon={<RiNotification3Line />}
        /> */}

        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
      </div>
    </div>
  )
}
