import { IoSettings } from "react-icons/io5";
import { FaCircleDollarToSlot } from "react-icons/fa6";

import { TbLayoutDashboardFilled } from "react-icons/tb";
import { ImStatsDots } from "react-icons/im";
import { TbSettingsAutomation } from "react-icons/tb";
import { FaFileLines, FaYoutube } from "react-icons/fa6";
import { IoBarChart } from "react-icons/io5";
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
];

export const community = [
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
];
