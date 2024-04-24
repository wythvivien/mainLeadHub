import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdUpdate, MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { useState } from "react";
import { format } from "date-fns";
import {
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} from "../../app/api/leadsApiSlice";
import { openMsgSnackbar } from "../../app/features/snackbar";
import { useDispatch } from "react-redux";

const WarmTable = ({ leads, onUpdate, refetch}) => {
  const [openStates, setOpenStates] = useState(Array(leads.length).fill(false)); 
  const [deleteLead] = useDeleteLeadMutation();
   const [updateLead] = useUpdateLeadMutation();
   const dispatch = useDispatch();

  const options = [
    "Convert to Cold",
    "Convert to Dead",
    "Delete Lead",
  ];

  const handleClick = async (option, lead) => {
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

  const capitalizeName = (name) => {
    if (name && name.trim() !== "") {
      const words = name.split(" ");
      const capitalizedName = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
      return capitalizedName.join(" ");
    } else {
      return ""; // Return empty string if name is undefined or empty
    }
  };

  const toggleDropdown = (index) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
  };

  return (
    <table className="table-auto w-full h-fit border-2 font-medium min-w-max">
      <thead className="border-2 ">
        <tr className="bg-zinc-100">
          <th className="py-3 font-semibold text-base md:text-lg border-2">#</th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            LEAD NAME
          </th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            CONTACTS
          </th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            SOURCE
          </th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            COLUMN
          </th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            STATUS
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead, index) => (
          <tr key={index} className="border-t border-2 bg-white">
            <td className=" text-center px-6 py-6">
              {index+1}
            </td>
            <td className="px-8">
              <div className="flex gap-5 items-center">
                <img src={lead.image} alt="" className="size-12 rounded-full" />
                <div className="flex flex-col gap-0.5">
                  <h1 className="text-sm md:text-base font-medium">
                    {capitalizeName(lead.account)}
                  </h1>
                  <div className="flex gap-1 text-xs md:text-sm font-medium items-center">
                    <MdUpdate className="size-4 md:size-5" />
                    <p className="text-xs md:text-sm font-medium">
                      {format(lead.createdAt, "MM/dd/yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </td>

            <td className=" px-8 text-sm md:text-base">
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-1 text-xs md:text-sm font-medium items-center">
                  <MdOutlineEmail className="size-4 md:size-5" />
                  <p className="text-xs md:text-sm font-medium">{lead.email}</p>
                </div>
                <div className="flex gap-1 text-xs md:text-sm font-medium items-center">
                  <MdOutlinePhone className="size-4 md:size-5" />
                  <p className="text-xs md:text-sm font-medium">
                    {lead.number ? lead.number : "Not Updated"}
                  </p>
                </div>
              </div>
            </td>
            <td className=" px-8 text-sm md:text-base text-center">
              {lead.source ? lead.source : "Not Updated"}
            </td>
            <td className=" px-12 text-sm md:text-base text-center">
              {lead.column ? (
                lead.column
              ) : (
                <button
                  className="bg-active text-sidebar py-1.5 md:py-2 w-fit px-4 text-center rounded-md text-xs sm:text-sm whitespace-nowrap font-semibold"
                  onClick={() => onUpdate(lead._id)}
                >
                  Start Progress
                </button>
              )}
            </td>
            <td className=" px-12 text-sm md:text-base text-center">
              {lead.status}
            </td>

            <td className="px-6 py-4 relative">
              <div className="flex items-center justify-center h-full">
                <HiOutlineDotsHorizontal
                  size={22}
                  onClick={() => toggleDropdown(index)}
                />
              </div>
              <div
                className={`z-10 absolute bg-white drop-shadow-md border rounded-md mt-2 w-fit overflow-y-auto max-h-60 top-10 right-4 md:right-8 ${
                  openStates[index] ? "block" : "hidden"
                }`}
              >
                <ul>
                  {options.map((option, index) => (
                    <li
                      key={index}
                      onClick={() => handleClick(option, lead)}
                      className="px-5 py-2 hover:bg-green-900 hover:text-white text-xs md:text-sm"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WarmTable;
