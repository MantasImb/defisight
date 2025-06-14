/* eslint-disable react/jsx-key */
// This rule is used because the old version of react-table provides a key prop which is provided using the spread operator
// There is no functionality issue with this

import React, { useEffect, useContext, useState } from "react";

import { useTable } from "react-table";

import { Tooltip, Button, Card } from "flowbite-react";
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";
import { SiEthereum, SiBinance } from "react-icons/si";

import { ReactComponent as ArbitrumLogo } from "../assets/arbitrum-logo.svg";
import { ReactComponent as OptimismLogo } from "../assets/optimism-logo.svg";

import { APIContext } from "../contexts/APIProvider";
import { StateContext } from "../contexts/StateProvider";

import { shortenAddress } from "../../utils/shortenAddress";
import {
  openInExplorerNewTab,
  openTxInExplorerNewTab,
} from "../../utils/openInNewTab";
import { getAge } from "../../utils/getAge";
import { AiFillEye } from "react-icons/ai";
import { Header } from "../components";
import { twMerge } from "tailwind-merge";
import {
  bgColorVariants,
  borderColorVariants,
} from "../../utils/colorVariance";

export default function LiveTransactions() {
  const [date, setDate] = useState(new Date());
  const {
    notifications,
    setNotifications,
    markNotificationAsSeen,
    markAllNotificationsAsSeen,
    deleteAllNotifications,
  } = useContext(APIContext);
  const { currentColor } = useContext(StateContext);

  function handleNotificationClick(notification) {
    if (!notification.seen) {
      markNotificationAsSeen(notification._id);
      setNotifications((notifications) => {
        return notifications.map((n) => {
          if (n._id === notification._id) {
            return { ...n, seen: true };
          }
          return n;
        });
      });
    }
    openTxInExplorerNewTab(notification.hash, notification.chainId);
    // TODO: open modal to show transaction details and a button to open in explorer
  }

  function handleAllSeenClick() {
    markAllNotificationsAsSeen();
    setNotifications((notifications) => {
      return notifications.map((n) => {
        return { ...n, seen: true };
      });
    });
  }

  const data = React.useMemo(() => notifications, [notifications]);

  const columns = React.useMemo(
    () => [
      {
        id: "inspectTx",
        accessor: (row) => row,
        Cell: ({ value }) => (
          <>
            <Button
              className="mr-2"
              color={currentColor}
              size="xs"
              onClick={() => handleNotificationClick(value)}
            >
              <AiFillEye className="text-white" />
            </Button>
          </>
        ),
      },
      {
        Header: "Tx Hash",
        accessor: (row) => row,
        Cell: ({ value }) => (
          <p
            onClick={() => handleNotificationClick(value)}
            className="cursor-pointer underline hover:no-underline"
          >
            {shortenAddress(value.hash)}
          </p>
        ),
      },
      {
        Header: "Tag",
        accessor: (row) => {
          return { tag: row.tag, highlight: row.highlight };
        },
        Cell: ({ value }) => (
          <div
            className="rounded-md border"
            style={{ borderColor: value.highlight }}
          >
            <p className={"px-1"}>{value.tag}</p>
          </div>
        ),
      },
      {
        Header: "Method",
        accessor: "method",
      },
      {
        id: "Direction",
        accessor: (row) => ({
          from: row.from,
          to: row.to,
          direction: row.direction,
        }),
        Cell: ({ value }) =>
          value.direction === "in" ? (
            <BsArrowLeftShort className="mr-2 text-2xl" />
          ) : (
            <BsArrowRightShort className="mr-2 text-2xl" />
          ),
      },
      {
        Header: "Address",
        accessor: (row) => ({
          from: row.from,
          to: row.to,
          direction: row.direction,
          id: row,
          chainId: row.chainId,
        }),
        Cell: ({ value }) => (
          <Button
            outline={false}
            color={currentColor}
            size="xs"
            onClick={(e) => {
              let address = value.direction === "in" ? value.from : value.to;
              console.log();
              openInExplorerNewTab(address, value.chainId);
              e.stopPropagation();
            }}
          >
            {value.direction === "in"
              ? shortenAddress(value.from)
              : shortenAddress(value.to)}
          </Button>
        ),
      },
      {
        Header: "Value",
        accessor: (row) => ({
          value: row.value,
          chainId: row.chainId,
        }),
        Cell: ({ value }) => (
          <div className="flex justify-center">
            <p>{(value.value / 10 ** 18).toString().slice(0, 5)}</p>
            {value.chainId == 1 && <SiEthereum className="mx-1 self-center" />}
            {value.chainId == 56 && <SiBinance className="mx-1 self-center" />}
            {value.chainId == 42161 && (
              <ArbitrumLogo className="mx-1 h-5 w-5 self-center" />
            )}
            {value.chainId == 10 && (
              <OptimismLogo className="mx-1 h-5 w-5 self-center" />
            )}
            {value.chainId == 11155111 && (
              <p className="mx-1 self-center">Sep</p>
            )}
          </div>
        ),
      },
      {
        Header: "Age",
        accessor: "timestamp",
        Cell: ({ value }) => (
          <Tooltip
            content={
              <p className="whitespace-nowrap">
                {new Date(value * 1000).toUTCString()}
              </p>
            }
          >
            <p className="ml-2 text-center text-xs text-gray-500 underline">
              {getAge(value, false, date)} ago
            </p>
          </Tooltip>
        ),
      },
    ],
    [notifications, date, currentColor]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-3xl bg-white p-2 py-8 dark:bg-secondary-dark-bg md:px-8">
      <div className="flex flex-col justify-between sm:flex-row">
        <Header
          title="Live Transactions"
          info="View transactions of all your tracked wallets"
        />
        <div className="flex items-center gap-2">
          <p
            style={{ color: currentColor }}
            className="cursor-pointer italic"
            onClick={handleAllSeenClick}
          >
            ✓ <span className="underline">Mark all as seen.</span>
          </p>
          <p className="text-transparent/50">|</p>
          <p
            className="cursor-pointer italic text-red-600"
            onClick={deleteAllNotifications}
          >
            <span className="underline">Clear all.</span>
          </p>
        </div>
      </div>
      {notifications.length > 0 && (
        <table
          className={twMerge(
            "mx-auto block w-full overflow-auto rounded-md shadow-md sm:w-fit",
            bgColorVariants({ color: currentColor })
          )}
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className="p-1 text-center text-sm font-thin text-white"
                    {...column.getHeaderProps()}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            className="bg-gray-50 text-black dark:bg-gray-800 dark:text-white"
            {...getTableBodyProps()}
          >
            {rows.map((row) => {
              prepareRow(row);

              return (
                <tr
                  className={twMerge(
                    !row.original.seen
                      ? "border-l-4"
                      : "bg-slate-50 dark:bg-gray-600",
                    borderColorVariants({ color: currentColor })
                  )}
                  {...row.getRowProps()}
                >
                  {/* <div className={}/> */}
                  {row.cells.map((cell) => {
                    return (
                      <td
                        className="border-b-1 p-1 md:px-2 md:py-3 md:text-lg"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {notifications.length === 0 && (
        <Card>
          <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            No transactions to show.
          </h5>
          <p className="text-center font-normal text-gray-700 dark:text-gray-400">
            Did you add a wallet? <br />
            You can add wallets in the Tracked Wallets tab.
          </p>
        </Card>
      )}
    </div>
  );
}
