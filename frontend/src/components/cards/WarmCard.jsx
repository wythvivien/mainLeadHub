import { HiOutlineMail } from "react-icons/hi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  useDeleteLeadMutation,
  useUpdateLeadMutation,
} from "../../app/api/leadsApiSlice";
import { } from "../../app/api/leadsApiSlice";
import { openMsgSnackbar } from "../../app/features/snackbar";
import { useDispatch } from "react-redux";


const WarmCard = ({ lead, onUpdate, refetch }) => {
  const [open, setOpen] = useState(false);
  const [deleteLead] = useDeleteLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const dispatch = useDispatch();

  const options = ["Convert to Cold", "Convert to Dead", "Delete Lead"];

  const handleClick = async (option) => {
    try {
      switch (option) {
        case "Delete Lead":
          await deleteLead({ leadId: lead._id });
          dispatch(
            openMsgSnackbar({
              message: "Deleted Successfully",
              type: "success",
            })
          );
          break;
        case "Convert to Cold":
          await updateLead({ leadId: lead._id, data: { status: "Cold" } });
          dispatch(
            openMsgSnackbar({
              message: "Updated Successfully",
              type: "success",
            })
          );
          break;
        case "Convert to Dead":
          await updateLead({ leadId: lead._id, data: { status: "Dead" } });
          dispatch(
            openMsgSnackbar({
              message: "Updated Successfully",
              type: "success",
            })
          );
          break;
        default:
          break;
      }
      refetch();
    } catch (err) {
      dispatch(openMsgSnackbar({ message: err, type: "error" }));
    }
  };

  return (
    <article className="col-span-1 border rounded-md hover:shadow-md place-self-auto bg-white">
      <header className="flex justify-end items-center px-2.5 pt-3 relative">
        <BsThreeDotsVertical
          className="size-5 text-gray-500"
          onClick={() => setOpen(!open)}
        />
        <div
          className={` z-10 absolute bg-white drop-shadow-md border rounded-md mt-2 w-fit overflow-y-auto max-h-60 top-7 right-3 ${
            open ? "block" : "hidden"
          }`}
        >
          <ul>
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  setOpen(false);
                  handleClick(option);
                }}
                className="px-5 py-2 hover:bg-green-900 hover:text-white text-xs md:text-sm"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      </header>
      <div className="flex flex-col px-4 items-center justify-center pb-6 relative -mt-3">
        <div className="flex justify-center my-3">
          <img
            src={lead.image}
            alt=""
            className="size-16 md:size-20 border rounded-full"
          />
        </div>
        <h2 className="mb-1 font-semibold text-sm md:text-base break-words w-full text-center overflow-x-auto">
          {lead.account}
        </h2>
        <h3 className="mb-4 md:mb-6 font-medium text-xs md:text-sm break-words w-full text-center overflow-x-auto">
          {lead.email}
        </h3>
        {lead.column ? (
          <h1 className="bg-active text-sidebar py-1.5 md:py-2 w-fit px-12 text-center rounded-md text-xs sm:text-sm whitespace-nowrap font-semibold">
            {lead.column}
          </h1>
        ) : (
          <button
            className="bg-active text-sidebar py-1.5 md:py-2 w-fit px-6 md:px-12 text-center rounded-md text-xs sm:text-sm whitespace-nowrap font-semibold "
            onClick={() => onUpdate()}
          >
            Start Progress
          </button>
        )}
      </div>
      <footer className="flex justify-between items-center border-t py-2 px-2.5">
        <div
          className="flex items-center gap-1.5 "
          onClick={() => (window.location.href = lead.link)}
        >
          <HiOutlineMail className="size-4 sm:size-[18px] text-gray-500" />
          <p className="font-semibold text-xs text-gray-500">Email</p>
        </div>
        <div className="flex gap-0.5 items-center">
          <p className="font-semibold text-xs text-gray-500">See Details</p>
          <Link to={`${lead.account}`}>
            <MdKeyboardArrowRight className=" size-4 sm:size-[18px] text-gray-500" />
          </Link>
        </div>
      </footer>
    </article>
  );
};

export default WarmCard;
