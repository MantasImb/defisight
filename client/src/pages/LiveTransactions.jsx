// TODO: Add unseen notification functionality
// TODO: Add styles for an unseen notification

import React, { useEffect, useContext, useState } from "react";

import { useTable } from "react-table";

import { Dropdown, Tooltip, Button } from "flowbite-react";
import { RiNotification3Line } from "react-icons/ri";
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";
import { SiEthereum } from "react-icons/si";

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

export default function LiveTransactions() {
  const [date, setDate] = useState(new Date());
  const {
    notifications,
    setNotifications,
    unseenNotifications,
    markNotificationAsSeen,
    markAllNotificationsAsSeen,
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
              color={"purple"}
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
            outline={true}
            color="purple"
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
            {value.chainId == 5 && <p className="mx-1 self-center">GT</p>}
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
    [notifications, date]
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
    <div className="m-2 mt-14 h-screen rounded-3xl bg-white p-2 md:mx-10 md:mt-4 md:p-8">
      <div className="flex flex-col justify-between sm:flex-row">
        <Header category="Main" title="Live Transactions" />
        <p
          style={{ color: currentColor }}
          className="cursor-pointer self-center italic"
          onClick={handleAllSeenClick}
        >
          ✓ <span className="underline">Mark all as seen.</span>
        </p>
      </div>
      <table
        className="mx-auto block h-3/5 w-full overflow-auto rounded-md shadow-md sm:w-fit"
        {...getTableProps()}
      >
        <thead className="border-b-1 border-b-purple-600">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="p-1 text-center text-sm font-thin text-purple-600"
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return (
              <tr
                className={
                  !row.original.seen
                    ? "border-l-4 border-purple-600 hover:bg-gray-100"
                    : "bg-slate-50 hover:bg-gray-100"
                }
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
    </div>
  );
}
