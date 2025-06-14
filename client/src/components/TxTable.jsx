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
import { twMerge } from "tailwind-merge";
import {
  bgColorVariants,
  borderColorVariants,
  textColorVariants,
} from "../../utils/colorVariance";

export default function TxTable({ data, chainId }) {
  const { screenSize, currentColor } = useContext(StateContext);

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
              outline={false}
              color={currentColor}
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
              color={value.bonus.isError == 0 ? { currentColor } : "failure"}
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
    <>
      <table
        className={twMerge(
          "rounded-md text-center text-white shadow sm:w-fit",
          bgColorVariants({ color: currentColor })
        )}
        {...getTableProps()}
      >
        <thead className="">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th className="px-2 py-1" {...column.getHeaderProps()}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          className="h-full bg-gray-50 text-black dark:bg-gray-700 dark:text-white"
          {...getTableBodyProps()}
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    className={twMerge(
                      "border-b-1 px-2 py-1",
                      borderColorVariants({ color: currentColor })
                    )}
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
      <div className="flex flex-row pt-2 md:justify-center">
        <Button
          size="sm"
          className="ml-1 hidden dark:text-white md:block"
          color={currentColor}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"First"}
        </Button>
        <Button
          size="sm"
          className="ml-1  dark:text-white"
          color={currentColor}
          onClick={previousPage}
          disabled={!canPreviousPage}
        >
          {"<"}
        </Button>
        <span
          className={twMerge(
            "ml-1 flex items-center rounded-md px-3 py-1.5 text-center text-sm text-white",
            bgColorVariants({ color: currentColor })
          )}
        >
          Page:
          <input
            className={twMerge(
              "mx-2 h-6 w-8 rounded-md border-none text-center font-semibold",
              textColorVariants({ color: currentColor })
            )}
            placeholder={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
          />
          of {pageOptions.length}
        </span>
        <Button
          size="sm"
          color={currentColor}
          className="ml-1 rounded-md dark:text-white"
          onClick={nextPage}
          disabled={!canNextPage}
        >
          {">"}
        </Button>
        <Button
          size="sm"
          color={currentColor}
          className="ml-1 hidden rounded-md dark:text-white md:block"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {"Last"}
        </Button>
      </div>
    </>
  );
}
