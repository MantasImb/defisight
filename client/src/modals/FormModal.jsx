import { Button } from "flowbite-react";
import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { twMerge } from "tailwind-merge";
import { AiOutlineClose } from "react-icons/ai";

import { StateContext } from "../contexts/StateProvider";
import { borderColorVariants } from "../../utils/colorVariance";

export default function FormModal({ isOpen, children, onClose, onSubmit }) {
  if (!isOpen) return null;

  const { currentColor, currentMode } = useContext(StateContext);

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={twMerge(
          "fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50",
          currentMode === "Dark" && "dark"
        )}
      ></div>
      {/* content */}
      <div
        className={twMerge(
          borderColorVariants({ color: currentColor }),
          "fixed left-1/2 top-1/2 z-20 flex w-96 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border bg-white p-5 shadow-lg dark:bg-secondary-dark-bg"
        )}
      >
        <AiOutlineClose
          className="ml-auto rounded-full p-1 text-gray-500 hover:bg-light-gray"
          fontSize={24}
          onClick={onClose}
        />
        <div className="m-2 p-2 text-center">{children}</div>
        <div className="flex flex-nowrap justify-center text-white">
          <Button onClick={onSubmit} size="md" color={currentColor}>
            Submit
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}
