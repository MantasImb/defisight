import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { RiContactsLine, RiStockLine } from "react-icons/ri";
import { AiOutlineCalendar, AiOutlineStock } from "react-icons/ai";
import { FaTelegram, FaTwitter } from "react-icons/fa";
import { SiMedium } from "react-icons/si";
import { TbRadar2 } from "react-icons/tb";
import { GiToken } from "react-icons/gi";
import image from "../assets/logominified-removebg-preview.png";
import { StateContext } from "../contexts/StateProvider";
import { twMerge } from "tailwind-merge";
import { bgColorVariants, textColorVariants } from "../../utils/colorVariance";

const links = [
  {
    title: "Main",
    links: [
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
      className={twMerge(
        textColorVariants({ color }),
        "relative cursor-not-allowed rounded-full p-3 text-xl hover:bg-light-gray"
      )}
    >
      {icon}
    </button>
  );
}

export default function Sidebar() {
  const { activeMenu, setActiveMenu, screenSize, currentColor, setToastState } =
    useContext(StateContext);

  function handleCloseSideBar() {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  }

  const activeLink = twMerge(
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2",
    bgColorVariants({ color: currentColor })
  );
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
              <NavLink
                to={`/token-info`}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <GiToken className="animate-pulse text-lg text-red-500" />
                <span className="animate-pulse text-lg capitalize text-red-500 underline underline-offset-2">
                  Our token
                </span>
              </NavLink>
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
                icon={<FaTwitter />}
                color={currentColor}
                customFunc={() => {
                  setToastState({
                    message: "The project has sunset.",
                    type: "error",
                  });
                }}
              />
              <SocialButton
                icon={<FaTelegram />}
                color={currentColor}
                customFunc={() => {
                  setToastState({
                    message: "The project has sunset.",
                    type: "error",
                  });
                }}
              />
              <SocialButton
                icon={<SiMedium />}
                color={currentColor}
                customFunc={() => {
                  setToastState({
                    message: "The project has sunset.",
                    type: "error",
                  });
                }}
              />
            </div>
          </div>
          <span className="absolute bottom-1 left-1 text-xs font-thin text-slate-500">
            v1.4
          </span>
        </>
      )}
    </div>
  );
}
