import SubmitButton from "../../components/button/SubmitButton";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
import { useListLeadsQuery } from "../../app/api/leadsApiSlice";
import { toggleTaskForm } from "../../app/features/toggle";
import { useDispatch, useSelector } from "react-redux";
import { BiChevronDown } from "react-icons/bi";
import { useAddTasksMutation } from "../../app/api/leadDetailsApiSlice";
import { useUpdateTasksMutation } from "../../app/api/calendarApiSlice";

const AddTask = () => {
  const [person, setPerson] = useState(null);
  const [addTasks] = useAddTasksMutation();
  const [updateTasks] = useUpdateTasksMutation();
  const [type, setType] = useState(null);
  const [openPerson, setOpenPerson] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [openType, setOpenType] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    type: "",
    date: "",
    time: "",
  });

  const { data: leads } = useListLeadsQuery();

  const taskForm = useSelector((state) => state.toggle.taskForm);
  const taskObj = useSelector((state) => state.toggle.task);

  useEffect(() => {
      if(taskObj) {
        setEditMode(true);

        setTask({
          title: taskObj.title,
          description: taskObj.description,
          dueDate: taskObj.dueDate,
          type: taskObj.type,
          date: taskObj.date,
          time: taskObj.time,
        });
      }
  }, [taskObj]);
  
  const dispatch = useDispatch();

  const options = ["Meetings", "Appointment", "Deadline"]

  const submitHandler = async (e) => {
    e.preventDefault();
    debugger;
    try {
      if(!editMode) {
        await addTasks({ leadAccount: person, data: task });
        toast("Task Updated Successfully");
        setTask({
          title: "",
          description: "",
          dueDate: "",
          type: "",
          date: "",
          time: "",
        });
        refetch();
      } else {
        task.taskId = taskObj._id;
        await updateTasks({ data: task });
        toast("Task Updated Successfully");
        refetch();
      }
    
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };


  return (
    <aside
      className={`${
        taskForm ? "block" : "hidden"
      } h-full w-screen sm:w-[370px] z-50 fixed top-0 right-0 bg-white drop-shadow-2xl`}
    >
      <MdClose
        className="size-6 absolute right-6 top-5 cursor-pointer"
        onClick={() => dispatch(toggleTaskForm(false))}
      />
      <div className="border-b-4 p-6 mt-5">
        <h2 className="text-sm text-icons font-semibold">RESPONSIBILITIES</h2>
        <h1 className="text-base font-bold">UPCOMING REQUIRED TASKS</h1>
      </div>
      <p className="px-6 py-4 text-sm text-icons">
        Nurture your leads by being responsible of the created tasks. Tasks are
        specific to each of your leads regarding their needs
      </p>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col px-6 gap-3 my-3">
          <div className="relative w-full font-medium text-sm">
            <div
              onClick={() => setOpenPerson(!openPerson)}
              className={`flex bg-stone-100 border rounded-sm px-2 py-1.5 text-sm items-center justify-between cursor-pointer ${
                !person && "md:text-gray-500"
              }`}
            >
              <span className="truncate">
                {person ? person : "Choose your lead"}
              </span>
              <BiChevronDown
                size={20}
                className={`${openPerson && "rotate-180"} `}
              />
            </div>
            <div
              className={` absolute z-10 bg-white border shadow-sm rounded-md mt-2 w-full overflow-y-auto max-h-60 right-0 ${
                openPerson ? "block" : "hidden"
              }`}
            >
              <ul>
                {leads &&
                  leads.map((lead, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setPerson(lead.account);
                        setOpenPerson(false);
                      }}
                      className="p-2 hover:bg-green-900 hover:text-white"
                    >
                      {lead.account}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="relative w-full font-medium text-sm ">
            <div
              onClick={() => setOpenType(!openType)}
              className={`flex bg-stone-100 border rounded-sm px-2 py-1.5 text-sm items-center justify-between cursor-pointer ${
                !person && "md:text-gray-500"
              }`}
            >
              <span className="truncate hidden xl:block">
                {type ? type : "Type of Task"}
              </span>
              <BiChevronDown
                size={20}
                className={`${openType && "rotate-180"} hidden xl:block`}
              />
            </div>
            <div
              className={` absolute z-10 bg-white border shadow-sm rounded-md mt-2 w-full overflow-y-auto max-h-60 right-0 ${
                openType ? "block" : "hidden"
              }`}
            >
              <ul>
                {options.map((option, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setType(option);
                      setOpenType(false);
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

          <div className="flex flex-col gap-2 font-medium mt-3">
            <p className="text-[13px] font-semibold">Task Assignment:</p>
            <input
              type="text"
              placeholder="Title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="text-sm rounded-sm outline-none w-full bg-stone-100 border px-2 py-1"
            />
            <textarea
              placeholder="Enter task description..."
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              className="w-full border rounded-sm h-40 bg-stone-100 text-sm outline-none p-2"
            ></textarea>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[13px] font-semibold">
                {type !== "Deadline" ? "Schedule" : "Due Date:"}
              </label>
              <div className="flex w-full gap-5 justify-start">
                <input
                  type="date"
                  value={task.date}
                  onChange={(e) => setTask({ ...task, date: e.target.value })}
                  className="bg-stone-100 text-[13px] outline-none px-1 py-1 border"
                />
                <input
                  type="time"
                  value={task.time}
                  onChange={(e) => setTask({ ...task, time: e.target.value })}
                  className="bg-stone-100 text-[13px] outline-none px-1 py-1 border"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex px-6 justify-end mt-8">
          {!editMode && (<SubmitButton text="Add Task" />)}
          {editMode && (<SubmitButton text="Update Task" />)}
        </div>
      </form>
    </aside>
  );
};

export default AddTask;
