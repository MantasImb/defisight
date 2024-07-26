import { Button, Label, Select, TextInput, Spinner } from "flowbite-react";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ethers } from "ethers";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { BsDot } from "react-icons/bs";

export default function NewWalletModal({ isOpen, onClose, onSubmit, isDev }) {
  if (!isOpen) return null;

  const [formValues, setFormValues] = useState({
    tag: "",
    address: "",
    chainId: 1,
    highlight: "gray",
  });

  const [formErrors, setFormErrors] = useState({
    tag: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    setFormErrors((prev) => {
      return {
        ...prev,
        [name]: "",
      };
    });
  }

  function handleColorClick(value) {
    setFormValues((prev) => {
      return {
        ...prev,
        highlight: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({
      tag: "",
      address: "",
    });
    let block = false;

    if (formValues.tag === "") {
      block = true;
      setFormErrors((prev) => {
        return {
          ...prev,
          tag: "Tag is required",
        };
      });
    }

    if (formValues.tag.length > 20) {
      block = true;
      setFormErrors((prev) => {
        return {
          ...prev,
          tag: "Tag must be less than 20 characters",
        };
      });
    }

    if (formValues.address === "") {
      block = true;
      setFormErrors((prev) => {
        return {
          ...prev,
          address: "Address is required",
        };
      });
    }

    // check if address is valid

    const isAddress = ethers.utils.isAddress(formValues.address);
    if (!isAddress) {
      block = true;
      setFormErrors((prev) => {
        return {
          ...prev,
          address: "Invalid address",
        };
      });
    }

    if (!block) {
      console.log("submitting");
      let response = await onSubmit(formValues);
      if (response) isSubmitting(false);
    }

    setIsSubmitting(false);
  }

  return ReactDOM.createPortal(
    <>
      {/* overlay */}
      <div
        onClick={() => onClose()}
        className="fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50"
      ></div>
      {/* content */}
      <div className="fixed top-1/2 left-1/2 z-20 flex w-96 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border border-purple-700 bg-white p-5 shadow-lg">
        <AiOutlineClose
          className="ml-auto rounded-full p-1 text-gray-500 hover:bg-light-gray"
          fontSize={24}
          onClick={() => onClose()}
        />
        <div className="m-2 p-2">
          {" "}
          <div className="text-md flex flex-col gap-4 md:text-lg">
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
                  <span className="italic text-red-500">{formErrors.tag}</span>
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label color="purple" value="Highlight:" />
              </div>
              <div className="flex flex-row justify-center">
                <div
                  className="mx-1 rounded-full bg-gray-400 p-2"
                  onClick={() => handleColorClick("gray")}
                >
                  {formValues.highlight === "gray" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>

                <div
                  className="mx-1 rounded-full bg-orange-400 p-2"
                  onClick={() => handleColorClick("orange")}
                >
                  {formValues.highlight === "orange" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 rounded-full bg-green-400 p-2"
                  onClick={() => handleColorClick("green")}
                >
                  {formValues.highlight === "green" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 rounded-full bg-yellow-400 p-2"
                  onClick={() => handleColorClick("yellow")}
                >
                  {formValues.highlight === "yellow" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 rounded-full bg-red-400 p-2"
                  onClick={() => handleColorClick("red")}
                >
                  {formValues.highlight === "red" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 rounded-full bg-blue-400 p-2"
                  onClick={() => handleColorClick("blue")}
                >
                  {formValues.highlight === "blue" ? (
                    <AiOutlineCheck />
                  ) : (
                    <BsDot />
                  )}
                </div>
                <div
                  className="mx-1 rounded-full bg-pink-400 p-2"
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
                  <span className="italic text-red-500">
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
                <option value={11155111}>sepolia</option>
                {/* Below are disabled because the project is sunset and is only used as a showcase */}
                <option
                  disabled
                  value={1}
                  className="cursor-not-allowed text-red-400"
                >
                  Ethereum
                </option>
                <option disabled value={42161} className="text-red-400">
                  Arbitrum
                </option>
                <option disabled value={56} className="text-red-400">
                  Binance
                </option>
                <option disabled value={10} className="text-red-400">
                  Optimism
                </option>
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
  );
}
