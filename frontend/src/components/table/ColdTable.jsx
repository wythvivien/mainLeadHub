import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { format } from "date-fns";
import { useState } from "react";
import {
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} from "../../app/api/leadsApiSlice";
import { openMsgSnackbar } from "../../app/features/snackbar";
import { useDispatch } from "react-redux";

const ColdTable = ({ leads, refetch }) => {
  const [openStates, setOpenStates] = useState(Array(leads.length).fill(false));
  const [deleteLead] = useDeleteLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const dispatch = useDispatch();

  const options = ["Convert to Warm", "Convert to Dead", "Delete Lead"];

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
        case "Convert to Warm":
          await updateLead({ leadId: lead._id, data: { status: "Warm" } });
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

  const countDown = (date) => {
    const differenceMs = date - Date.now();
    // Convert milliseconds to days
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    return differenceDays;
  };

  const toggleDropdown = (index) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = !newOpenStates[index];
    setOpenStates(newOpenStates);
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

  return (
    <table className="table-auto w-full h-fit border-2 font-medium min-w-max">
      <thead className="border-2 ">
        <tr className="bg-zinc-100">
          <th className="py-3 font-semibold text-sm md:text-base border-2">#</th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            Lead Name
          </th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            Email Account
          </th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            Status
          </th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            Expiration
          </th>
          <th className="py-3 font-semibold text-sm md:text-base border-2">
            Created Date
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead, index) => (
          <tr key={index} className="border-t border-2 bg-white">
            <td className=" text-center px-6 py-4">{index + 1}</td>
            <td className="px-8">
              <div className="flex gap-5 items-center">
                <img src={lead.image} alt="" className="size-10 rounded-full" />
                <p className="text-sm md:text-base">
                  {capitalizeName(lead.account)}
                </p>
              </div>
            </td>

            <td className=" px-8 text-sm md:text-base">{lead.email}</td>
            <td className=" px-12 text-sm md:text-base text-center">
              {lead.status}
            </td>
            <td className="px-12 text-sm md:text-base text-center">
              {countDown(new Date(lead.expirationDate))} days
            </td>
            <td className="px-12 text-sm md:text-base text-center">
              {format(lead.createdAt, "MMMM dd, yyyy")}
            </td>
            <td className="px-6 py-4 relative">
              <div className="flex items-center justify-center h-full ">
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

export default ColdTable;
