import React, { useContext } from "react";
import { ToggleSwitch } from "flowbite-react";

import { StateContext } from "../contexts/StateProvider";
import { FaCheck } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { bgColorVariants } from "../../utils/colorVariance.js";

const colorOptions = ["green", "red", "purple"];

export default function ThemeSidebar() {
  const { setMode, currentMode, currentColor, setColor } =
    useContext(StateContext);

  return (
    <div className="ml-3 flex h-screen flex-grow flex-col items-center gap-4 overflow-hidden bg-white py-10 dark:bg-secondary-dark-bg">
      <h1 className="text-2xl font-semibold dark:text-white">
        Customization Menu
      </h1>
      <div className="flex h-full flex-col items-start justify-start">
        <div className="flex items-center justify-center gap-2 p-4">
          <ToggleSwitch
            checked={currentMode === "Dark"}
            color={currentColor}
            onChange={() => setMode(currentMode === "Dark" ? "Light" : "Dark")}
          />
          <p className="text-lg font-semibold dark:text-white">Dark mode</p>
        </div>
        <div className="flex-col p-4">
          <p className="text-lg font-semibold dark:text-white">Color Options</p>
          <div className="flex items-center gap-2">
            {colorOptions.map((color) => (
              <ColorButton
                color={color}
                key={color}
                clickHandler={() => setColor(color)}
                isActive={currentColor === color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorButton({ color, isActive, clickHandler }) {
  return (
    <div
      onClick={clickHandler}
      className={twMerge(
        bgColorVariants({ color }),
        "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:drop-shadow-xl"
      )}
    >
      {isActive && <FaCheck color="white" className="text-xl text-white" />}
    </div>
  );
}
