import React from "react"
import ReactDOM from "react-dom"

import { MdOutlineCancel } from "react-icons/md"
import { AiOutlineClose } from "react-icons/ai"

function Modal({ isOpen, children, onClose }) {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-10"
      ></div>
      {/* content */}
      <div className="fixed flex flex-col overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 border border-[#3d4f7c] w-96 shadow-lg rounded-md bg-gray-800 bg-opacity-95 z-20">
        <AiOutlineClose
          className="ml-auto text-gray-500"
          fontSize={24}
          onClick={onClose}
        />
        <div className="m-2 p-2 text-center text-white">{children}</div>
        <div className="flex flex-nowrap">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}

export default Modal
