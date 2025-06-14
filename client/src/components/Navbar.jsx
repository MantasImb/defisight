import React, { useEffect, useContext } from "react";
import { AiOutlineMenu } from "react-icons/ai";

import { Notifications } from ".";

import { StateContext } from "../contexts/StateProvider";
import { twMerge } from "tailwind-merge";
import { textColorVariants } from "../../utils/colorVariance";

function NavButton({ customFunc, icon, color, isActive }) {
  return (
    <button
      type="button"
      onClick={customFunc}
      className={twMerge(
        textColorVariants({ color }),
        "relative rounded-full p-3 text-2xl hover:bg-light-gray"
      )}
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

  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);

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
    <div className="relative flex justify-between p-2 px-6">
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
  );
}
