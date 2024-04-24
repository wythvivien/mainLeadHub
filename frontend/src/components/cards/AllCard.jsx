import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import {
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} from "../../app/api/leadsApiSlice";
import { openMsgSnackbar } from "../../app/features/snackbar";
import { useDispatch } from "react-redux";

const AllCard = ({ lead, refetch }) => {
  const [open, setOpen] = useState(false);
  const [deleteLead] = useDeleteLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const dispatch = useDispatch();

  const options = {
    Dead: ["Convert to Warm", "Convert to Cold", "Delete Lead"],
    Warm: ["Convert to Cold", "Convert to Dead", "Delete Lead"],
    Cold: ["Convert to Warm", "Convert to Dead", "Delete Lead"],
  };

  const handleOptionClick = async (option) => {
    setOpen(false);
    try {
      switch (option) {
        case "Delete Lead":
          await deleteLead({ leadId: lead._id });
          dispatch(openMsgSnackbar({ message: "Deleted Successfully", type: "success" }));
          break;
        case "Convert to Warm":
        case "Convert to Dead":
        case "Convert to Cold":
          await updateLead({ leadId: lead._id, data: { status: option.split(" ")[2] } });
          dispatch(openMsgSnackbar({ message: "Updated Successfully", type: "success" }));
          break;
        default:
          break;
      }
      refetch();
    } catch (err) {
      dispatch(openMsgSnackbar({ message: err, type: "error" }));
    }
  };

  function checkStatus(status) {
    switch (status) {
      case "Warm":
        return "bg-active text-sidebar";
      case "Cold":
        return "bg-gray-300";
      case "Dead":
        return "bg-sidebar text-white";
      default:
        return "";
    }
  }

  return (
    <article className="col-span-1 border rounded-md hover:shadow-md bg-white relative">
      <header className="flex justify-end items-center px-2.5 pt-4 relative">
        <BsThreeDotsVertical
          className="size-5 text-gray-500"
          onClick={() => setOpen(!open)}
        />
        <div
          className={`z-10 absolute bg-white drop-shadow-md border rounded-md mt-2 w-fit overflow-y-auto max-h-60 top-7 right-3 ${
            open ? "block" : "hidden"
          }`}
        >
          <ul>
            {options[lead.status].map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="px-5 py-2 hover:bg-green-900 hover:text-white text-xs md:text-sm"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center p-4 -mt-5">
        <div className="flex justify-center mb-4">
          <img
            src={lead.image}
            alt=""
            className="size-16 border rounded-full"
          />
        </div>
        <h2 className="mb-1 font-semibold text-sm w-full text-center truncate">
          {lead.account}
        </h2>
        <h3 className="mb-4 font-medium tracking-tight text-sm  w-full text-center truncate">
          {lead.email}
        </h3>
        <h1
          className={`${checkStatus(
            lead.status
          )} py-1.5 md:py-2 w-fit px-12 text-center rounded-md text-xs sm:text-sm whitespace-nowrap font-semibold`}
        >
          {lead.status}
        </h1>
      </div>
      <span
        className={`absolute top-0.5 rounded-t-md left-0 w-full h-1 ${checkStatus(
          lead.status
        )} transition-transform transform -translate-y-1/2`}
      ></span>
    </article>
  );
};

export default AllCard;

