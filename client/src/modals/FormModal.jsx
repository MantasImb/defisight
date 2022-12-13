import { Button } from "flowbite-react"
import React from "react"
import ReactDOM from "react-dom"
import { AiOutlineClose } from "react-icons/ai"

export default function FormModal({ isOpen, children, onClose, onSubmit }) {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-10"
      ></div>
      {/* content */}
      <div className="fixed flex flex-col overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 border border-purple-700 w-96 shadow-lg rounded-md bg-white z-20">
        <AiOutlineClose
          className="ml-auto text-gray-500 rounded-full p-1 hover:bg-light-gray"
          fontSize={24}
          onClick={onClose}
        />
        <div className="m-2 p-2 text-center">{children}</div>
        <div className="flex flex-nowrap justify-center text-white">
          <Button onClick={onSubmit} size="md" color="purple">
            Submit
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}
