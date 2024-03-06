import { Button } from "flowbite-react";
import React from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";

export default function FormModal({ isOpen, children, onClose, onSubmit }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50"
      ></div>
      {/* content */}
      <div className="fixed top-1/2 left-1/2 z-20 flex w-96 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border border-[#ff9922] bg-white p-5 shadow-lg">
        <AiOutlineClose
          className="ml-auto rounded-full p-1 text-gray-500 hover:bg-light-gray"
          fontSize={24}
          onClick={onClose}
        />
        <div className="m-2 p-2 text-center">{children}</div>
        <div className="flex flex-nowrap justify-center text-white">
          <Button
            onClick={onSubmit}
            size="md"
            color="primary"
            className="bg-[#ff9922] hover:bg-[#ff9700]"
          >
            Submit
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}
