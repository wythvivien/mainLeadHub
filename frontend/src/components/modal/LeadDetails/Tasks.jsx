import {
  useAddTasksMutation,
} from "../../../app/api/leadDetailsApiSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const Tasks = ({refetch}) => {
  const [option, setOption] = useState(null);
  const [open, setOpen] = useState(false);
  const { leadAccount } = useParams();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    type: "",
    date: "",
    time: "",
  });
  const [addTasks] = useAddTasksMutation();

  const options = ["Event", "Appointment", "Deadline"];
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await addTasks({ leadAccount, data: task });
      toast("Updated Successfully");
      setTask({
        title: "",
        description: "",
        type: "",
        date: "",
        time: ""
      });
      refetch();
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="p-7">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold">Task Assignment</label>
              <div className="relative w-2/5 text-sm">
                <div
                  onClick={() => setOpen(!open)}
                  className={`flex bg-stone-100 border rounded-sm px-2 py-0.5 text-xs items-center justify-between cursor-pointer ${
                    !option && "md:text-gray-500"
                  }`}
                >
                  <span className="truncate">
                    {option ? option : "Type of Task"}
                  </span>
                  <BiChevronDown
                    size={20}
                    className={`${open && "rotate-180"} `}
                  />
                </div>
                <div
                  className={` absolute z-10 bg-white border shadow-sm rounded-md mt-2 w-full overflow-y-auto max-h-60 right-0 ${
                    open ? "block" : "hidden"
                  }`}
                >
                  <ul>
                    {options.map((option, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setOption(option);
                          setOpen(false);
                          setTask({ ...task, type: option });
                        }}
                        className="p-2 hover:bg-green-900 hover:text-white"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <input
              type="text"
              placeholder="Write task title"
              value={task.title}
              onChange={(e) =>
                setTask({ ...task, title: e.target.value })
              }
              className="rounded-sm py-1 px-2  border bg-zinc-100 text-xs outline-none"
            />
            <textarea
              id="tasks"
              autoComplete="off"
              value={task.description}
              placeholder="Write your task here"
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              className="w-96 h-36 rounded-sm p-2 border bg-zinc-100 text-xs outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <label htmlFor="date" className="text-xs font-semibold">
              {option !== "Deadline" ? "Schedule" : "Due Date"}
            </label>
            <input
              id="date"
              type="date"
              value={task.date}
              autoComplete="off"
              onChange={(e) => setTask({ ...task, date: e.target.value })}
              className=" rounded-sm  px-2 py-1 border bg-zinc-100 text-xs outline-none"
            />
            <input
              id="date"
              type="time"
              value={task.time}
              autoComplete="off"
              onChange={(e) => setTask({ ...task, time: e.target.value })}
              className=" rounded-sm  px-2 py-1 border bg-zinc-100 text-xs outline-none "
            />
          </div>
        </div>
        <div className="bg-sidebar px-5 py-3 flex justify-end">
          <button
            className=" bg-active py-1.5 px-5 rounded-sm text-xs whitespace-nowrap font-semibold"
            onClick={submitHandler}
          >
            Add Tasks
          </button>
        </div>
      </div>
    </>
  );
};

export default Tasks;
