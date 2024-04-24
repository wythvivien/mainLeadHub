import { BsThreeDots } from "react-icons/bs";
import { useState } from "react";
import { TbCurrencyPeso } from "react-icons/tb";
import { useDispatch } from "react-redux"
import { openMsgSnackbar } from "../../app/features/snackbar";
import { useSetOppValMutation, useRemoveCardMutation} from "../../app/api/columnApiSlice";

const BoardCard = ({ leadId, refetch }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(false);
  const [oppVal, setOppVal] = useState(leadId.oppVal)
  const [setOpportunityValue] = useSetOppValMutation();
  const [removeCard] = useRemoveCardMutation();
  const dispatch = useDispatch();

  const options = ["Create Deal", "Set Value", "Remove Card"];
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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await setOpportunityValue({ leadId: leadId._id, oppVal: oppVal });
      setValue(false)
      dispatch(
        openMsgSnackbar({ message: "Opportunity Value is set", type: "success" })
      );
      refetch();
    } catch (err) {
      dispatch(openMsgSnackbar({ message: "Opportunity Value is not set", type: "error" }));
    }
  };

  const handleClick = async (option) => {
      switch (option) {
        case "Create Deal":
          break;
        case "Set Value":
          setValue(true)
          break;
        case "Remove Card":
          try {
            await removeCard({ leadId: leadId._id});
            dispatch(
              openMsgSnackbar({
                message: "Removed Card Successfully",
                type: "success",
              })
            );
            refetch();
          } catch (err) {
            dispatch(openMsgSnackbar({ message: "Opportunity Card not set", type: "error" }));
          }
          break;
        default:
          break;
      }
  };

  return (
    <div className="relative">
      <div className="relative flex flex-col justify-center drop-shadow-sm bg-white rounded-sm px-3 py-3 gap-2">
        <BsThreeDots
          className="z-20 size-4 text-gray-500 absolute top-2 right-4 cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        <div className="flex gap-2 justify-start items-center relative  ">
          <img
            src={leadId?.image}
            alt=""
            className="size-10 border rounded-full"
          />
          <div className="flex-col w-3/4">
            <h1 className=" text-sm md:text-base font-semibold">
              {capitalizeName(leadId?.account)}
            </h1>
            <h2 className="text-xs md:text-sm text-gray-400 truncate">
              {leadId?.email}
            </h2>
          </div>
        </div>
        <div className="flex w-3/4 items-center gap-2 font-medium text-sm my-1">
          <label htmlFor="valueTag">Opportunity Value:</label>
          <p
            className={`${
              value ? "hidden" : "flex"
            } text-sm font-semibold items-center`}
          >
            <TbCurrencyPeso size={18} />
            {leadId.oppVal}
          </p>
          <div className={`${value ? "flex" : "hidden"} items-center`}>
            <input
              id="value"
              type="text"
              autoComplete="off"
              value={oppVal}
              onChange={(e) =>
                setOppVal(e.target.value)
              }
              placeholder={leadId.oppVal}
              className=" w-20 rounded-s-sm px-2 py-0.5  border bg-zinc-100 text-xs outline-none"
            />
            <div
              className="border border-green-900 bg-green-900 px-2 py-[1px] rounded-e-sm cursor-pointer "
              onClick={submitHandler}
            >
              <TbCurrencyPeso size={18} className="text-white" />
            </div>
          </div>
        </div>
        {leadId?.tags.length > 0 && (
          <div className="flex justify-start items-center gap-2 ">
            {leadId?.tags.map((tag) => (
              <p
                className="text-[10px] md:text-xs font-medium px-1.5 py-0.5 border bg-stone-100"
                key={tag}
              >
                {tag}
              </p>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          className={`z-10 absolute bg-white drop-shadow-md border rounded-md mt-2 w-fit max-h-60 top-4 right-3 cursor-pointer`}
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
      )}
    </div>
  );
};

export default BoardCard;
