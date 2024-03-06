import { Button } from "flowbite-react";
import React, { useEffect, useState, useContext } from "react";
import { AiOutlineCheck, AiOutlineCopy, AiOutlineMenu } from "react-icons/ai";
// import { FiShoppingCart } from "react-icons/fi";
// import { MdKeyboardArrowDown } from "react-icons/md";

import { shortenAddress } from "../../utils/shortenAddress";

import { Notifications } from ".";

import { StateContext } from "../contexts/StateProvider";

function NavButton({ title, customFunc, icon, color, isActive, data }) {
  return (
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative rounded-full p-3 text-2xl hover:bg-light-gray"
    >
      {isActive && (
        <span
          style={{ background: "#03C9D7" }}
          className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full"
        />
      )}
      {icon}
    </button>
  );
}

export default function Navbar() {
  const { setActiveMenu, screenSize, setScreenSize, currentColor } =
    useContext(StateContext);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);

    // pretty sure unneeded, needs testing
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);
  return (
    <div className="relative flex justify-between p-2 md:mx-6">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevValue) => !prevValue)}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-3">
        {screenSize < 700 ? (
          <p>
            $SCOUT{" "}
            {shortenAddress("0x2d0405406f75E75f83457d2d3d2933d7244bEb30")}
          </p>
        ) : (
          <p>$SCOUT 0x2d0405406f75E75f83457d2d3d2933d7244bEb30</p>
        )}
        <div
          onClick={() => {
            navigator.clipboard.writeText(
              "0x2d0405406f75E75f83457d2d3d2933d7244bEb30"
            );
            setCopied(true);
          }}
        >
          {copied ? (
            <AiOutlineCheck className="rounded-lg border-2 border-[#ff9922]/90 p-1 text-3xl text-[#ff9922]/90 hover:cursor-pointer" />
          ) : (
            <AiOutlineCopy className="rounded-lg border-2 border-[#ff9922]/90 p-1 text-3xl text-[#ff9922]/90 hover:cursor-pointer" />
          )}
        </div>
      </div>
      <div className="flex items-center">
        <Notifications />
      </div>
    </div>
  );
}
