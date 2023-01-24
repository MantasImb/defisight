import React, { useEffect, useContext, useState } from "react"

import { Dropdown, Tooltip, Button } from "flowbite-react"
import { RiNotification3Line } from "react-icons/ri"
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs"

import { APIContext } from "../contexts/APIProvider"
import { StateContext } from "../contexts/StateProvider"

import { shortenAddress } from "../../utils/shortenAddress"
import {
  openInExplorerNewTab,
  openTxInExplorerNewTab,
} from "../../utils/openInNewTab"
import { getAge } from "../../utils/getAge"

export default function Notifications() {
  const [date, setDate] = useState(new Date())
  const {
    notifications,
    setNotifications,
    unseenNotifications,
    markNotificationAsSeen,
    markAllNotificationsAsSeen,
  } = useContext(APIContext)
  const { currentColor } = useContext(StateContext)

  function handleNotificationClick(notification) {
    if (!notification.seen) {
      markNotificationAsSeen(notification._id)
      setNotifications((notifications) => {
        return notifications.map((n) => {
          if (n._id === notification._id) {
            return { ...n, seen: true }
          }
          return n
        })
      })
    }
    openTxInExplorerNewTab(notification.hash, notification.chainId)
    // TODO: open modal to show transaction details and a button to open in explorer
  }

  function handleAllSeenClick() {
    markAllNotificationsAsSeen()
    setNotifications((notifications) => {
      return notifications.map((n) => {
        return { ...n, seen: true }
      })
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date())
    }, 1000)
    console.log(date)
    return () => clearInterval(interval)
  }, [])

  return (
    <Dropdown
      label={
        <div className="relative text-2xl rounded-full p-3 hover:bg-light-gray">
          <RiNotification3Line style={{ color: currentColor }} />
          {unseenNotifications > 0 && (
            <span className="absolute inline-flex rounded-full px-1 right-1 top-1 text-xs bg-red-500 text-white">
              {unseenNotifications}
            </span>
          )}
        </div>
      }
      placement="left"
      inline={true}
      arrowIcon={false}
      className="max-h-[400px] overflow-y-auto overflow-x-hidden"
    >
      <Dropdown.Header className="flex justify-between items-center">
        <p
          style={{ color: currentColor }}
          className="whitespace-nowrap text-lg font-bold"
        >
          Notifications
        </p>
        <p
          style={{ color: currentColor }}
          className="text-xs cursor-pointer"
          onClick={handleAllSeenClick}
        >
          ✓ <span className="underline">Mark all as seen.</span>
        </p>
      </Dropdown.Header>
      {notifications.length ? (
        notifications.map((notification) => (
          <div className="flex" key={notification._id}>
            <div
              className="w-[3px] rounded-sm"
              style={notification.seen ? {} : { backgroundColor: currentColor }}
            />

            <Dropdown.Item
              className={notification.seen ? "flex-1" : "flex-1 bg-slate-50"}
              onClick={() => handleNotificationClick(notification)}
            >
              {/* TODO: Add onClick functionality to the tag, to redirect the page to the wallet info */}
              <p
                className="rounded-md border px-1 mx-auto overflow-hidden max-w-[120px] whitespace-nowrap overflow-ellipsis"
                style={{ borderColor: notification.highlight }}
                onClick={(e) => {
                  let address =
                    notification.direction === "in"
                      ? notification.to
                      : notification.from
                  openInExplorerNewTab(address, notification.chainId)
                  e.stopPropagation()
                }}
              >
                {notification.tag}
              </p>
              <p className="pl-2 underline">{notification.method}</p>
              {notification.direction === "in" ? (
                <BsArrowLeftShort className="text-2xl mr-2" />
              ) : (
                <BsArrowRightShort className="text-2xl mr-2" />
              )}

              <Button
                outline={true}
                color="purple"
                size="xs"
                onClick={(e) => {
                  let address =
                    notification.direction === "in"
                      ? notification.from
                      : notification.to
                  openInExplorerNewTab(address, notification.chainId)
                  e.stopPropagation()
                }}
              >
                {notification.direction === "in"
                  ? shortenAddress(notification.from)
                  : shortenAddress(notification.to)}
              </Button>
              <Tooltip
                content={
                  <p className="whitespace-nowrap">
                    {new Date(notification.timestamp * 1000).toUTCString()}
                  </p>
                }
              >
                <p className="text-xs text-gray-500 ml-2 w-5 text-center underline">
                  {getAge(notification.timestamp, true, date)}
                </p>
              </Tooltip>
            </Dropdown.Item>
          </div>
        ))
      ) : (
        <p className="text-center italic">No notifications to show.</p>
      )}
    </Dropdown>
  )
}
