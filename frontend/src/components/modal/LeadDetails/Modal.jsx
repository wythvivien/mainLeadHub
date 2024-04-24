import { useSelector, useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { toggleEditDetails } from "../../../app/features/toggle";
import Details from "./Details";
import Notes from "./Notes";
import Tasks from "./Tasks";

const Modal = ({ refetch, taskRefetch }) => {
  const toggle = useSelector((state) => state.toggle);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div
      className={`z-30 absolute ${
        toggle.editDetails ? "flex flex-col" : "hidden"
      } w-fit h-fit bg-white shadow-lg drop-shadow-lg fixed top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 items-center justify-center`}
    >
      <div className="h-12 w-full px-5 pt-2 mt-2 border-b-2">
        <ul className="flex gap-10 h-full">
          <li className="flex items-center  ">
            <button
              className="font-bold text-green-900 text-sm "
              onClick={() => setActiveTab(1)}
            >
              Details
            </button>
          </li>

          <li className="flex items-center ">
            <button
              className="font-bold text-sidebar text-sm "
              onClick={() => setActiveTab(2)}
            >
              Notes
            </button>
          </li>

          <li className="flex items-center  ">
            <button
              className="font-bold text-sidebar text-sm "
              onClick={() => setActiveTab(3)}
            >
              Tasks
            </button>
          </li>
        </ul>
      </div>

      <div className="max-w-full">
        {activeTab === 1 && <Details refetch={() => refetch()} />}
        {activeTab === 2 && <Notes refetch={() => refetch()} />}
        {activeTab === 3 && <Tasks refetch={() => taskRefetch()} />}
      </div>

      <MdClose
        className="size-6 absolute right-3 top-2 text-zinc-500"
        onClick={() => dispatch(toggleEditDetails(false))}
      />
    </div>
  );
};

export default Modal;
