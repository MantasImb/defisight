import { Button } from "flowbite-react"
import React, { useEffect, useContext } from "react"
import { AiOutlineMenu } from "react-icons/ai"
import { FiShoppingCart } from "react-icons/fi"
import { MdKeyboardArrowDown } from "react-icons/md"

import { Notifications } from "."

import { StateContext } from "../contexts/StateProvider"

function NavButton({ title, customFunc, icon, color, isActive, data }) {
  return (
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-2xl rounded-full p-3 hover:bg-light-gray"
    >
      {isActive && (
        <span
          style={{ background: "#03C9D7" }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
      {icon}
    </button>
  )
}

export default function Navbar() {
  const { setActiveMenu, screenSize, setScreenSize, currentColor } =
    useContext(StateContext)

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
      <div className="flex items-center">
        <Notifications />
      </div>
    </div>
  )
}
