/* eslint-disable react/jsx-key */
// This rule is used because the old version of react-table provides a key prop which is provided using the spread operator
// There is no functionality issue with this
import React, { useMemo, useContext, useEffect } from "react";
import { useTable, usePagination } from "react-table";

import { Tooltip, Button } from "flowbite-react";
import { AiFillEye, AiOutlineInfoCircle } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";

import { getAge } from "../../utils/getAge";
import { shortenAddress } from "../../utils/shortenAddress";
import {
  openInExplorerNewTab,
  openTxInExplorerNewTab,
} from "../../utils/openInNewTab";

import { StateContext } from "../contexts/StateProvider";

export default function TxTable({ data, chainId }) {
  const { screenSize } = useContext(StateContext);

  function AddressCell({ value }) {
    let string;
    if (value) {
      string = shortenAddress(value);
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
    );
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
    );
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
            <p className="w-28 truncate text-left underline">{value}</p>
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
  );

  const dataMemo = useMemo(() => data, []);

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
      initialState: { pageSize: 25 },
    },
    usePagination
  );

  const { pageIndex } = state;

  useEffect(() => {
    if (screenSize < 540) setHiddenColumns("timestamp");
  }, [screenSize]);

  return (
    <div className="h-screen">
      <table
        className="my-2 mx-auto block h-3/5 overflow-y-auto rounded-md bg-purple-700 text-center text-white shadow sm:w-fit"
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
        <tbody className="bg-gray-50 text-black" {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    className="border-b-1 border-purple-700 py-1 px-2"
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-row md:justify-center">
        <Button
          size="sm"
          className="ml-1  hidden text-white md:block"
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
        <span className="ml-1 flex items-center rounded-md bg-purple-700 py-1.5 px-3 text-center text-sm text-white">
          Page:{" "}
          <input
            className="mx-2 h-6 w-8 rounded-md border-none text-center font-semibold text-purple-700"
            placeholder={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
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
          className="ml-1 hidden rounded-md text-white md:block"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {"Last"}
        </Button>
      </div>
    </div>
  );
}
