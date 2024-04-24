import { IoMdAdd } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarLeftCollapseFilled,
} from "react-icons/tb";
import { PiNotePencilBold } from "react-icons/pi";
import { HiMenuAlt1 } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleLeadForm,
  toggleEmailForm,
  toggleTaskForm,
  toggleDealForm,
  toggleSidebar,
} from "../app/features/toggle.js";

import { useState } from "react";
import { useLoginQuery } from "../app/api/usersApiSlice.js";

const Header = () => {
  // Reducer Context Hooks
  const [action, setAction] = useState(false);
  const dispatch = useDispatch();
  const toggle = useSelector((state) => state.toggle);
  const activeTab = useSelector((state) => state.active.activeTab);

  const { data: user } = useLoginQuery();

  const handleForm = (form) => {
    dispatch(toggleLeadForm(form === "lead"));
    dispatch(toggleEmailForm(form === "email"));
    dispatch(toggleTaskForm(form === "task"));
    dispatch(toggleDealForm(form === "deal"));
    setAction(false);
  };

  return (
    <div className="w-screen">
      <div
        className={`${
          toggle.sidebar
            ? " md:w-[calc(100%-256px)] md:left-64 "
            : "md:w-[calc(100%-64px)] md:left-16 md:pl-10 "
        } w-full z-30 fixed hidden md:flex items-center justify-between pl-5 pr-5 h-16 top-0 border-b-2 bg-white`}
      >
        <div className="h-full flex items-center gap-5">
          <div
            className="border-r-2 flex items-center pr-5 h-full "
            onClick={() => {
              dispatch(toggleSidebar());
            }}
          >
            {toggle.sidebar ? (
              <TbLayoutSidebarLeftCollapseFilled className="size-8 text-sidebar cursor-pointer" />
            ) : (
              <TbLayoutSidebarLeftExpandFilled className="size-8 text-sidebar cursor-pointer" />
            )}
          </div>

          <div className=" flex gap-2.5">
            <FiSearch className="size-6 text-sidebar" />
            <input
              type="text"
              placeholder="Search your leads here"
              className="outline-none text-sm font-medium w-[170px]"
            />
          </div>
        </div>

        <div className="gap-2 justify-center items-center flex relative h-full">
          <button
            className="hidden rounded-full bg-active pl-2 pr-3 lg:pl-3.5 lg:pr-5 py-2 lg:flex items-center"
            onClick={() => setAction(!action)}
          >
            <IoMdAdd className="size-5" />
            <h3 className="text-sm font-semibold ml-1 ">Quick Action</h3>
          </button>

          <button
            className="rounded-full p-1.5 bg-active lg:hidden"
            onClick={() => setAction(!action)}
          >
            <IoMdAdd className=" size-5" />
          </button>

          <img
            src={user?.image}
            alt="User Profile"
            className="flex lg:hidden size-9 rounded-full object-cover border-sidebar"
          />

          <div className="lg:flex hidden items-center justify-between cursor-pointer w-60 pl-5 border-l-2 ">
            <div className="flex gap-3 items-center ">
              <img
                src={user?.image}
                alt="User Profile"
                className="size-9 rounded-full object-cover border-sidebar"
              />
              <div className="flex flex-col w-2/3">
                <h2 className=" font-semibold text-sm text-sidebar">
                  {user?.displayName}
                </h2>
                <p className="text-xs font-medium text-icons break-words truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <BsThreeDotsVertical className="size-5 text-sidebar" />
          </div>
        </div>
      </div>

      <div className="w-full z-30 fixed flex md:hidden items-center justify-between pl-5 pr-5 h-16 top-0 border-b-2 bg-white">
        <HiMenuAlt1 size={24} onClick={() => dispatch(toggleSidebar())} />
        <h1 className="font-semibold text-lg">{activeTab}</h1>
        <PiNotePencilBold
          size={24}
          onClick={() => setAction(!action)}
          className="relative"
        />
      </div>

      <div
        className={`z-20 bg-white rounded-md border-2 shadow-md mt-2 overflow-y-auto w-40 max-h-60 right-5 lg:right-64 md:right-14 absolute top-16 ${
          action ? "block" : "hidden"
        }`}
      >
        <ul>
          <li
            className="py-2 px-4 hover:bg-amber-300 cursor-pointer"
            onClick={() => handleForm("lead")}
          >
            Create Lead
          </li>
          <li
            className="py-2 px-4 hover:bg-amber-300 cursor-pointer"
            onClick={() => handleForm("email")}
          >
            Send Email
          </li>
          <li
            className="py-2 px-4 hover:bg-amber-300 cursor-pointer"
            onClick={() => handleForm("task")}
          >
            Add Task
          </li>
          <li
            className="py-2 px-4 hover:bg-amber-300 cursor-pointer"
            onClick={() => handleForm("deal")}
          >
            Start Deal
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
