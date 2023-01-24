import { Button, Label, Select, TextInput, Spinner } from "flowbite-react"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { ethers } from "ethers"
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai"
import { BsDot } from "react-icons/bs"

export default function NewWalletModal({ isOpen, onClose, onSubmit, isDev }) {
  if (!isOpen) return null

  const [formValues, setFormValues] = useState({
    tag: "",
    address: "",
    chainId: 1,
    highlight: "gray",
  })

  const [formErrors, setFormErrors] = useState({
    tag: "",
    address: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleFormChange(event) {
    const { name, value } = event.target

    setFormValues((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })

    setFormErrors((prev) => {
      return {
        ...prev,
        [name]: "",
      }
    })
  }

  function handleColorClick(value) {
    setFormValues((prev) => {
      return {
        ...prev,
        highlight: value,
      }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({
      tag: "",
      address: "",
    })

    if (formValues.tag === "") {
      setFormErrors((prev) => {
        return {
          ...prev,
          tag: "Tag is required",
        }
      })
    }

    if (formValues.address === "") {
      setFormErrors((prev) => {
        return {
          ...prev,
          address: "Address is required",
        }
      })
    }

    // check if address is valid

    const isAddress = ethers.utils.isAddress(formValues.address)
    if (!isAddress) {
      setFormErrors((prev) => {
        return {
          ...prev,
          address: "Invalid address",
        }
      })
    }

    if (formErrors.address == "" && formErrors.tag == "") {
      console.log("submitting")
      let response = await onSubmit(formValues)
      if (response) isSubmitting(false)
    }

    setIsSubmitting(false)
  }

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div
        onClick={() => onClose()}
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-10"
      ></div>
      {/* content */}
      <div className="fixed flex flex-col overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 border border-purple-700 w-96 shadow-lg rounded-md bg-white z-20">
        <AiOutlineClose
          className="ml-auto text-gray-500 rounded-full p-1 hover:bg-light-gray"
          fontSize={24}
          onClick={() => onClose()}
        />
        <div className="m-2 p-2">
          {" "}
          <div className="flex flex-col gap-4 text-md md:text-lg">
            <div>
              <div className="mb-2 block">
                <Label color="purple" value="Wallet tag:" />
              </div>
              <TextInput
                id="tag"
                name="tag"
                required={true}
                color="purple"
                onChange={handleFormChange}
                helperText={
                  <span className="text-red-500 italic">{formErrors.tag}</span>
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label color="purple" value="Highlight:" />
              </div>
              <div className="flex flex-row justify-center">
                <div
                  className="mx-1 p-2 rounded-full bg-gray-400"
                  onClick={() => handleColorClick("gray")}
                >
                  {formValues.highlight === "gray" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>

                <div
                  className="mx-1 p-2 rounded-full bg-orange-400"
                  onClick={() => handleColorClick("orange")}
                >
                  {formValues.highlight === "orange" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 p-2 rounded-full bg-green-400"
                  onClick={() => handleColorClick("green")}
                >
                  {formValues.highlight === "green" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 p-2 rounded-full bg-yellow-400"
                  onClick={() => handleColorClick("yellow")}
                >
                  {formValues.highlight === "yellow" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 p-2 rounded-full bg-red-400"
                  onClick={() => handleColorClick("red")}
                >
                  {formValues.highlight === "red" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 p-2 rounded-full bg-blue-400"
                  onClick={() => handleColorClick("blue")}
                >
                  {formValues.highlight === "blue" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 p-2 rounded-full bg-pink-400"
                  onClick={() => handleColorClick("pink")}
                >
                  {formValues.highlight === "pink" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label color="purple" value="Address:" />
              </div>
              <TextInput
                id="address"
                name="address"
                placeholder="0x"
                required={true}
                color="purple"
                helperText={
                  <span className="text-red-500 italic">
                    {formErrors.address}
                  </span>
                }
                onChange={handleFormChange}
              />
            </div>
            <div id="select">
              <div className="mb-2 block">
                <Label htmlFor="chains" value="Chain:" />
              </div>
              <Select
                id="chains"
                name="chainId"
                required={true}
                onChange={handleFormChange}
              >
                <option value={1}>Ethereum</option>
                <option value={56}>Binance</option>
                {isDev && <option value={5}>Goerli</option>}
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-nowrap justify-center text-white">
          {isSubmitting ? (
            <Spinner color="purple" aria-label="Submitting" size="lg" />
          ) : (
            <Button
              onClick={handleSubmit}
              size="md"
              color="purple"
              disabled={formErrors.address.length || formErrors.tag.length}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </>,
    document.getElementById("portal")
  )
}
