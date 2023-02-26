// TODO: Add sidebar open/close animation.

import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine, RiStockLine } from "react-icons/ri";
import { AiOutlineCalendar, AiOutlineStock } from "react-icons/ai";
import { FaTelegram, FaTwitter, FaDiscord } from "react-icons/fa";
import { TbRadar2 } from "react-icons/tb";
import { CiMail } from "react-icons/ci";
import image from "../assets/logominified-removebg-preview.png";

const links = [
  {
    title: "Main",
    links: [
      // {
      //   name: "Dashboard",
      //   link: "dashboard",
      //   icon: <RiDashboardLine />,
      //   available: true,
      // },
      {
        name: "Live Transactions",
        link: "live-transactions",
        icon: <TbRadar2 />,
        available: true,
      },
      {
        name: "Tracked Wallets",
        link: "tracked-wallets",
        icon: <RiContactsLine />,
        available: true,
      },
      {
        name: "Wallet Info",
        link: "wallet-info",
        icon: <AiOutlineStock />,
        available: true,
      },
    ],
  },
  {
    title: "Coming soon",
    links: [
      // {
      //   name: "Token Chart",
      //   link: "token-info",
      //   icon: <RiStockLine />,
      //   available: true,
      // },
      // {
      //   name: "ICO Calendar",
      //   link: "calendar",
      //   icon: <AiOutlineCalendar />,
      //   available: true,
      // },
    ],
  },
];

function SocialButton({ customFunc, icon, color }) {
  return (
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative rounded-full p-3 text-xl hover:bg-light-gray"
    >
      {icon}
    </button>
  );
}

import { StateContext } from "../contexts/StateProvider";

export default function Sidebar() {
  const { activeMenu, setActiveMenu, screenSize, currentColor } =
    useContext(StateContext);

  function handleCloseSideBar() {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  }

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  return (
    <div className="ml-3 h-screen overflow-hidden pb-10">
      {activeMenu && (
        <>
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="ml-3 mt-4 flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
              <img src={image} className="w-12" /> <span>ChainWatcher</span>
            </Link>

            <button
              type="button"
              className="mt-4 block rounded-full p-3 text-xl hover:bg-light-gray md:hidden"
              onClick={() => setActiveMenu((prevValue) => !prevValue)}
            >
              <MdOutlineCancel />
            </button>
          </div>
          <div className="flex h-[95%] flex-col">
            <div className="mt-10">
              {links.map((item) => (
                <div key={item.title}>
                  <p className="m-3 mt-4 uppercase text-gray-400">
                    {item.title}
                  </p>
                  {item.links.map((link) => (
                    <NavLink
                      to={`/${link.link}`}
                      key={link.name}
                      onClick={handleCloseSideBar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? currentColor : "",
                      })}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      {link.icon}
                      <span className="capitalize">{link.name}</span>
                    </NavLink>
                  ))}
                </div>
              ))}
              <div className={`${normalLink} cursor-not-allowed`}>
                <RiStockLine />
                <span>Token Charts</span>
              </div>
              <div className={`${normalLink} cursor-not-allowed`}>
                <AiOutlineCalendar />
                <span>ICO Calendar</span>
              </div>
            </div>
            <div className="mt-auto flex justify-around">
              <SocialButton
                color={currentColor}
                icon={<FaTwitter />}
                customFunc={() => {}}
              />
              <SocialButton
                color={currentColor}
                icon={<FaTelegram />}
                customFunc={() => {}}
              />
              <SocialButton
                color={currentColor}
                icon={<FaDiscord />}
                customFunc={() => {}}
              />
            </div>
          </div>
          <span className="text-xs font-thin text-slate-500">v1.1</span>
        </>
      )}
    </div>
  );
}
