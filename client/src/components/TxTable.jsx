import React, { useMemo, useContext, useEffect } from "react"
import { useTable, usePagination } from "react-table"

import { Tooltip, Button, TextInput } from "flowbite-react"
import { AiFillEye, AiOutlineInfoCircle } from "react-icons/ai"
import { BiLinkExternal } from "react-icons/bi"

import { getAge } from "../../utils/getAge"
import { shortenAddress } from "../../utils/shortenAddress"
import {
  openInExplorerNewTab,
  openTxInExplorerNewTab,
  openInNewTab,
} from "../../utils/openInNewTab"

import { StateContext } from "../contexts/StateProvider"

export default function TxTable({ data, chainId }) {
  const { currentColor, currentMode, screenSize, setToastState } =
    useContext(StateContext)

  function AddressCell({ value }) {
    let string
    if (value) {
      string = shortenAddress(value)
    }

    return (
      <div>
        {value && (
          <Tooltip content={value}>
            <Button
              outline={true}
              color="purple"
              size="sm"
              onClick={() => openInExplorerNewTab(value)}
            >
              {string}
            </Button>
          </Tooltip>
        )}
      </div>
    )
  }

  function InspectTooltip({ data }) {
    return (
      <div className="flex flex-col text-left">
        <p className="text-lg">Additional info:</p>
        <p className="text-sm">
          Status: {data.bonus.isError == 0 ? "Success" : "Failed"}
        </p>
        <p className="text-sm">
          Transaction fee:{" "}
          {(data.bonus.gasUsed * data.bonus.gasPrice) / 10 ** 18} Ether
        </p>
        <p className="text-sm">Nonce: {data.bonus.nonce}</p>
        <a
          onClick={() => openTxInExplorerNewTab(data.hash, chainId)}
          className="cursor-pointer underline"
        >
          Open in explorer <BiLinkExternal className="inline" />
        </a>
      </div>
    )
  }

  const columns = useMemo(
    () => [
      {
        id: "inspectTx",
        accessor: (row) => row,
        Cell: ({ value }) => (
          <Tooltip
            content={<InspectTooltip data={value} />}
            placement="right"
            trigger="click"
          >
            <Button
              className="mr-2"
              color={value.bonus.isError == 0 ? "purple" : "failure"}
              size="xs"
            >
              <AiFillEye className="text-white" />
            </Button>
          </Tooltip>
        ),
      },
      {
        Header: (
          <div className="flex items-center">
            <span className="mr-1">Method</span>
            <Tooltip
              className="text-sm"
              content={
                "Function executed based on methodId data. Unregistered functions will be displayed as their id."
              }
              // style="light"
            >
              <AiOutlineInfoCircle className="hover:text-black" />
            </Tooltip>
          </div>
        ),
        accessor: "method",
        Cell: ({ value }) => (
          <Tooltip className="text-sm" content={value}>
            <p className="text-left truncate w-28 underline">{value}</p>
          </Tooltip>
        ),
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: ({ value }) => <p>{value}</p>,
      },
      {
        Header: "Age",
        accessor: "timestamp",
        Cell: ({ value }) => <p>{getAge(value)}</p>,
      },
      {
        Header: "From",
        accessor: "from",
        Cell: AddressCell,
      },
      {
        Header: "To",
        accessor: "to",
        Cell: AddressCell,
      },
    ],
    []
  )

  const dataMemo = useMemo(() => data, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    state,
    prepareRow,
    setHiddenColumns,
  } = useTable(
    {
      columns,
      data: dataMemo,
    },
    usePagination
  )

  const { pageIndex } = state

  useEffect(() => {
    if (screenSize < 720) setHiddenColumns("timestamp")
  }, [screenSize])

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto md:flex justify-center">
        <table
          className="rounded-md bg-purple-700 m-2 text-center text-white shadow"
          {...getTableProps()}
        >
          <thead className="">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th className="py-1 px-2" {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-black bg-gray-50" {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      className="py-1 px-2 border-b-1 border-purple-700"
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row md:justify-center">
        <Button
          size="sm"
          className="ml-1  text-white hidden md:block"
          color="purple"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"First"}
        </Button>
        <Button
          size="sm"
          className="ml-1  text-white"
          color="purple"
          onClick={previousPage}
          disabled={!canPreviousPage}
        >
          {"<"}
        </Button>
        <span className="flex text-sm py-1.5 px-3 ml-1 items-center text-center rounded-md text-white bg-purple-700">
          Page:{" "}
          <input
            className="w-8 h-6 mx-2 border-none rounded-md text-center font-semibold text-purple-700"
            placeholder={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
          />{" "}
          of {pageOptions.length}
        </span>
        <Button
          size="sm"
          color="purple"
          className="ml-1 rounded-md text-white"
          onClick={nextPage}
          disabled={!canNextPage}
        >
          {">"}
        </Button>
        <Button
          size="sm"
          color="purple"
          className="ml-1 rounded-md text-white hidden md:block"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {"Last"}
        </Button>
      </div>
    </div>
  )
}
