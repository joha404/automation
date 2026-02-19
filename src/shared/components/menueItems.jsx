import { MdDashboard, MdLiveHelp } from "react-icons/md";
import { BsClipboard2PlusFill, BsDatabaseFillGear } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { SiBookstack } from "react-icons/si";
import { PiNotebookFill } from "react-icons/pi";
import { IoSettings } from "react-icons/io5";
import { IoMdAnalytics } from "react-icons/io";
import { FaCircleDollarToSlot } from "react-icons/fa6";

import { TbLayoutDashboardFilled } from "react-icons/tb";
import { ImStatsDots } from "react-icons/im";
import { TbSettingsAutomation } from "react-icons/tb";
import { FaFileLines, FaYoutube } from "react-icons/fa6";
import { IoBarChart } from "react-icons/io5";
import { MdCalculate } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { GiQueenCrown } from "react-icons/gi";
import { FaUserFriends } from "react-icons/fa";

export const bettingTools = [
  {
    icon: <TbLayoutDashboardFilled size={20} />,
    text: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <ImStatsDots size={18} />,
    text: "Predictions",
    path: "/dashboard/predictions",
  },
  {
    icon: <TbSettingsAutomation size={22} />,
    text: "Automation",
    path: "/dashboard/automation",
  },
];

export const dataAnalysis = [
  {
    icon: <FaFileLines size={18} />,
    text: "Results",
    path: "/dashboard/results",
  },
  {
    icon: <IoBarChart size={18} />,
    text: "Past Predictions",
    path: "/dashboard/past-predictions",
  },
  // {
  //   icon: <MdCalculate size={18} />,
  //   text: "Betting Calculator",
  //   path: "/dashboard/betting-calculator",
  // },
];

export const community = [
  {
    icon: <FaCircleDollarToSlot size={18} />,
    text: (
      <span className="flex items-center gap-2">
        Rewards
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500 text-white font-semibold">
          New
        </span>
      </span>
    ),
    path: "/dashboard/rewards",
  },
  {
    icon: <HiOutlineStatusOnline size={18} />,
    text: "Chat Room",
    path: "/dashboard/chat-room",
  },
  {
    icon: <FaUserFriends size={18} />,
    text: "Referral Program",
    path: "/dashboard/referral-program",
  },
];

export const account = [
  {
    icon: <GiQueenCrown size={18} />,
    text: "Subscription Tiers",
    path: "/dashboard/subscription-tiers",
  },

  {
    icon: <IoSettings size={18} />,
    text: "Settings",
    path: "/dashboard/settings",
  },
  {
    icon: <FaYoutube size={18} />,
    text: "How To Videos",
    path: "/dashboard/how-to-videos",
  },
];
