import React from "react";
import { Tooltip } from "flowbite-react";
import { IoIosColorPalette } from "react-icons/io";
import { StateContext } from "../contexts/StateProvider";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { bgColorVariants } from "../../utils/colorVariance";

export default function CustomizationButton() {
  const { setThemeSettings, currentColor } = useContext(StateContext);
  async function handleClick() {
    setThemeSettings((prev) => !prev);
  }

  return (
    <Tooltip
      content="Customize your theme"
      className="overflow-x-hidden overflow-y-hidden p-2"
    >
      <div
        onClick={handleClick}
        className={twMerge(
          bgColorVariants({ color: currentColor }),
          "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full hover:drop-shadow-xl md:h-14 md:w-14"
        )}
      >
        <IoIosColorPalette
          color="white"
          className="text-2xl text-white md:text-4xl"
        />
      </div>
    </Tooltip>
  );
}
