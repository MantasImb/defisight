import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";

import { StateContext } from "../contexts/StateProvider";
import { APIContext } from "../contexts/APIProvider";

import { Button, Tooltip, Dropdown, Badge } from "flowbite-react";
import { AiFillEye, AiFillInfoCircle, AiOutlineStock } from "react-icons/ai";
import { SiBinance, SiEthereum } from "react-icons/si";
import { RiDeleteBin2Line } from "react-icons/ri";

import { ReactComponent as BscScanLogo } from "../assets/bscscan-logo.svg";
import { ReactComponent as EtherScanLogo } from "../assets/etherscan-logo.svg";
import { ReactComponent as ArbitrumLogo } from "../assets/arbitrum-logo.svg";
import { ReactComponent as OptimismLogo } from "../assets/optimism-logo.svg";

import { getAge } from "../../utils/getAge";
import { shortenAddress } from "../../utils/shortenAddress";
import { openInExplorerNewTab } from "../../utils/openInNewTab";
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";

// ADDRESS CELL

function AddressCell({ value }) {
  let { walletCA, chainId } = value;
  let string;
  if (walletCA) {
    string = shortenAddress(walletCA);
  }

  return (
    <div className="flex justify-center">
      {walletCA && (
        <Tooltip content={walletCA}>
          <Button
            outline={true}
            color="purple"
            size="sm"
            onClick={() => openInExplorerNewTab(walletCA, chainId)}
          >
            {string}
          </Button>
        </Tooltip>
      )}
    </div>
  );
}

// BALANCE CELL

function BalanceCell({ value }) {
  const { getBalance } = useContext(APIContext);
  const [balance, setBalance] = useState();

  useEffect(() => {
    getBalance(value.walletCA, value.chainId).then((res) => setBalance(res));
  }, []);

  return <div>{balance && <p>{balance.slice(0, 5)}</p>}</div>;
}

// TABLE

// BUG: Data is not memoized. This causes the table to re-render on every change to the data prop.
export default function WalletsTable({ data, setData }) {
  const { deleteWallet } = useContext(APIContext);
  const { setToastState } = useContext(StateContext);
  const navigate = useNavigate();

  function handleOpen(address, chainId) {
    navigate(`/wallet-info/${chainId}/${address}`);
  }

  const columns = useMemo(
    () => [
      {
        id: "linkToInfo",
        accessor: (row) => {
          return { walletCA: row.walletCA, chainId: row.chainId };
        },
        Cell: ({ value }) => (
          <Button
            onClick={() =>
              navigate(`/wallet-info/${value.chainId}/${value.walletCA}`)
            }
            className="mr-2"
            color="purple"
            size="xs"
          >
            <AiFillInfoCircle className="text-white" />
          </Button>
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
        Header: "Address",
        accessor: (row) => ({ walletCA: row.walletCA, chainId: row.chainId }),
        Cell: AddressCell,
      },
      {
        Header: "Chain",
        accessor: "chainId",
        Cell: ({ value }) => {
          let name;
          if (value == 1) name = "Ethereum Mainnet";
          if (value == 56) name = "Binance Smart Chain";
          if (value == 42161) name = "Arbitrum One";
          if (value == 10) name = "Optimism";

          return (
            <div className="flex justify-center text-lg">
              <Tooltip content={name}>
                {value == 1 && <SiEthereum />}
                {value == 56 && <SiBinance />}
                {value == 42161 && <ArbitrumLogo className="h-5 w-5" />}
                {value == 10 && <OptimismLogo className="h-5 w-5" />}
                {value == 11155111 && <p>Sep</p>}
              </Tooltip>
            </div>
          );
        },
      },
      {
        Header: "Balance",
        accessor: (row) => ({ walletCA: row.walletCA, chainId: row.chainId }),
        Cell: BalanceCell,
      },
      {
        Header: "Latest Activity",
        accessor: "lastTimestamp",
        Cell: ({ value }) => <p>{getAge(value)}</p>,
      },
      {
        id: "actions",
        accessor: (row) => ({
          walletCA: row.walletCA,
          chainId: row.chainId,
          id: row.id,
        }),
        Cell: (props) => (
          <Dropdown
            label={<BsThreeDotsVertical className="text-lg" />}
            placement="bottom"
            inline={true}
            arrowIcon={false}
          >
            <Dropdown.Item
              icon={AiOutlineStock}
              onClick={() =>
                handleOpen(props.value.walletCA, props.value.chainId)
              }
            >
              Open
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() =>
                openInExplorerNewTab(props.value.walletCA, props.value.chainId)
              }
            >
              {props.value.chainId == 1 && (
                <EtherScanLogo className="mr-2 h-4 w-4" />
              )}
              {props.value.chainId == 56 && (
                <BscScanLogo className="mr-2 h-4 w-4" />
              )}
              {props.value.chainId == 42161 && (
                <EtherScanLogo className="mr-2 h-4 w-4" />
              )}
              {props.value.chainId == 10 && (
                <EtherScanLogo className="mr-2 h-4 w-4" />
              )}
              Scanner
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              icon={RiDeleteBin2Line}
              onClick={() => {
                deleteWallet(props.value.id);
                // TODO : add undo functionality to toast
                setToastState({ message: "Wallet deleted", type: "success" });
                let tempData = [...data];
                tempData.splice(props.row.index, 1);
                setData(tempData);
              }}
            >
              Delete
            </Dropdown.Item>
          </Dropdown>
        ),
      },
    ],
    [data]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <table
      className="mx-auto block w-full overflow-auto rounded-md bg-purple-600 text-white shadow-md sm:w-fit"
      {...getTableProps()}
    >
      <thead>
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
        {rows.map((row) => {
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
  );
}
