import { TbCurrencyPeso } from "react-icons/tb";
import { format } from "date-fns";

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

const TaskBox = ({ tasks }) => {
 const todayTasks = tasks?.filter(
   (task) => task.date === format(Date.now(), "yyyy-MM-dd")
 );

  return (
    <div className="overflow-y-auto">
      <div className="flex border-b-2 px-5 py-3 items-center justify-between ">
        <h1 className=" text-green-900 font-bold text-lg">Today's Tasks</h1>
        <p className="text-green-900 text-sm font-semibold">View Calendar</p>
      </div>
      <div className="px-5 py-4 flex flex-col gap-5">
        <div className="flex justify-between items-center" >
          <div className="flex items-center gap-2" ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskBox;
