import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useUpdateLeadMutation, useDeleteLeadMutation } from "../../app/api/leadsApiSlice";
import { openMsgSnackbar } from "../../app/features/snackbar";
import { useDispatch } from "react-redux";

const ColdCard = ({ lead, refetch}) => {
  const [open, setOpen] = useState(false);
  const [deleteLead] = useDeleteLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const dispatch = useDispatch();

  const options = ["Convert to Warm", "Convert to Dead", "Delete Lead"]

  
  const handleClick = async(option) => {
   try {
      switch (option) {
        case "Delete Lead":
          await deleteLead({ leadId: lead._id });
          dispatch(openMsgSnackbar({ message: "Deleted Successfully", type: "success" }));
          break;
        case "Convert to Warm":
          await updateLead({ leadId: lead._id, data: { status: "Warm" } });
          dispatch(openMsgSnackbar({ message: "Updated Successfully", type: "success" }));
          break;
        case "Convert to Dead":
          await updateLead({ leadId: lead._id, data: { status: "Dead" } });
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

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const expirationDate = new Date(lead.expirationDate);
      if (currentDate >= expirationDate) {
        handleOptionClick("Convert to Dead");
      }
    }, 1000 * 60 * 60 * 24); // Check once per day
    return () => clearInterval(interval);
  }, [lead]);

  const countDown = (date) => {
    const differenceMs = date - Date.now();
    // Convert milliseconds to days
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    return differenceDays;
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
        <h1 className="bg-gray-300 text-sidebar py-1.5 md:py-2 w-fit px-12 text-center rounded-md text-xs sm:text-sm whitespace-nowrap font-semibold">
          {countDown(new Date(lead.expirationDate))} days
        </h1>
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

export default ColdCard;
