import { BiSolidDashboard, BiSolidBriefcaseAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdViewKanban, MdCalendarMonth } from "react-icons/md";

const tabList = [
  {
    icon: BiSolidDashboard,
    link: "dashboard",
    item: "Dashboard",
  },

  {
    item: "Pipeline",
    link: "pipeline",
    icon: MdViewKanban,
  },

  {
    icon: FaUsers,
    link: "lead",
    item: "Leads",
  },

  {
    item: "Deals",
    link: "deals",
    icon: BiSolidBriefcaseAlt,
  },

  {
    item: "Calendar",
    link: "calendar",
    icon: MdCalendarMonth,
  },
];

const sortOptions = ["Recency", "Logically", "Date"];

export { tabList, sortOptions };
