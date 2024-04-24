import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineUpdate, MdNotes } from "react-icons/md";
import { TbTagsOff } from "react-icons/tb";
import { useGetLeadQuery } from "../../app/api/leadsApiSlice";
import {
  useDeleteTagMutation,
  useDeleteNoteMutation,
  useDeleteTaskMutation,
} from "../../app/api/leadDetailsApiSlice";
import { useGetTasksQuery } from "../../app/api/leadDetailsApiSlice";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { FaRegNoteSticky } from "react-icons/fa6";
import { CgGoogleTasks } from "react-icons/cg";
import { IoIosCalendar, IoMdTrash } from "react-icons/io";
import { toggleEditDetails } from "../../app/features/toggle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { format } from "date-fns"
import { toast } from "react-toastify";
import Modal from "../../components/modal/LeadDetails/Modal";

const WarmDetails = () => {
  const { leadAccount } = useParams();
  const { data: lead, refetch } = useGetLeadQuery(leadAccount);
  const { data: tasks, refetch: taskRefetch } = useGetTasksQuery(leadAccount);
  const [deleteTag] = useDeleteTagMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = useSelector((state) => state.toggle);

  const removeTag = async (e, tagName) => {
    e.preventDefault();
    try {
      await deleteTag({ leadAccount, tagName }); // Call the delete tag mutation with lead account and tag ID
      toast("Tag deleted successfully");
      refetch();
      console.log("Refetched Data");
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  const removeNote = async (e, noteId) => {
    e.preventDefault();
    try {
      await deleteNote({ leadAccount, noteId }); // Call the delete tag mutation with lead account and tag ID
      toast("Note deleted successfully");
      refetch();
      console.log("Refetched Data");
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  const removeTask = async (e, taskId, completed) => {
    e.preventDefault();
    try {
      if (completed) {
        await deleteTask({ leadAccount, taskId });
        toast("Task deleted successfully");
        taskRefetch();
        console.log("Refetched Data");
      }
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  useEffect(() => {}, [lead, tasks]);
  return (
    <>
      <div className="w-full h-full bg-slate-100 overflow-y-hidden relative">
        <div className="flex flex-col gap-4 p-8 h-full ">
          <div className="flex h-fit bg-white rounded-lg hover:shadow-lg border">
            <div className="flex-none w-1/3 3xl:w-1/4 border-r-2 border-slate-200 p-5 ">
              <div className=" mb-7 flex gap-2 items-center">
                <IoChevronBackCircleOutline
                  className="text-green-900 size-5"
                  onClick={() => navigate(`dashboard/lead/warm`)}
                />
                <p className="font-semibold text-green-900 text-sm">
                  Back to leads
                </p>
              </div>
              <div className="flex flex-col justify-center items-center gap-2 ">
                <img
                  src={lead?.image}
                  alt=""
                  className="size-24 border rounded-full mb-3 border-sidebar "
                />
                <h2 className="text-lg font-semibold ">{lead?.account}</h2>
                <p className="text-gray-800 font-medium -mt-2 mb-3 tracking-tight">
                  {lead?.email}
                </p>

                <button
                  className="bg-active text-sidebar py-2 px-8 rounded-md text-[15px] whitespace-nowrap font-semibold"
                  onClick={() => dispatch(toggleEditDetails(true))}
                >
                  Edit Information
                </button>
              </div>
            </div>

            <div className="flex-1 py-5">
              <p className="text-green-900 font-semibold mb-3 3xl:text-base text-sm px-5">
                Lead Information
              </p>
              <div className="flex w-full gap-32 mb-5 px-5">
                <div className="flex flex-col">
                  <label htmlFor="number" className="text-sm font-semibold">
                    Phone
                  </label>

                  <p className="text-sm mt-1 py-1">{lead?.number}</p>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="address" className="text-sm font-semibold">
                    Address
                  </label>

                  <p className="w-72 3xl:w-[400px] text-sm mt-1 py-1">
                    {lead?.address}
                  </p>
                </div>
              </div>
              <div className="flex w-full gap-32 pb-5 px-5 border-b">
                <div className="flex flex-col ">
                  <label htmlFor="source" className="text-sm font-semibold">
                    Lead Source
                  </label>

                  <p className="text-sm mt-1 py-1">{lead?.source}</p>
                </div>

                <div className="flex flex-col ">
                  <label htmlFor="company" className="text-sm font-semibold">
                    Company
                  </label>

                  <p className=" text-sm mt-1 py-1">{lead?.company}</p>
                </div>

                <div className="flex flex-col ">
                  <label htmlFor="address" className="text-sm font-semibold">
                    Job Title
                  </label>

                  <p className=" text-sm mt-1 py-1">{lead?.job}</p>
                </div>
              </div>

              <div className="p-5 w-full">
                <div className="flex items-center gap-2 text-green-900">
                  <p className="font-semibold text-sm mb-3">Tag Lists</p>
                </div>
                <div className="flex flex-wrap w-full gap-5">
                  {lead?.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex gap-4 w-fit items-center px-2 py-1 border bg-stone-100 "
                    >
                      <p className="text-xs font-semibold">{tag}</p>
                      <TbTagsOff
                        size={18}
                        onClick={(e) => removeTag(e, tag)}
                        className="cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-64 flex gap-8">
            <div className="w-1/2 bg-white rounded-lg hover:shadow-lg border overflow-auto relative">
              <div className="max-h-full">
                <div className="flex mb-3 border-b-2 px-5 pt-3 pb-2 ">
                  <div className="flex gap-2 items-center">
                    <FaRegNoteSticky size={15} />
                    <h1 className="text-green-900 font-semibold 3xl:text-base text-sm">
                      Notes Taken
                    </h1>
                    <h2 className="text-green-900 font-bold px-2 bg-slate-200 rounded-sm 3xl:text-base text-sm">
                      {lead?.notes.length}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3 px-5">
                  {lead?.notes.map((note, index) => (
                    <div
                      className="flex border border-slate-300 rounded-md px-6 py-3 gap-6"
                      key={index}
                    >
                      <MdNotes size={20} />
                      <div className="w-full flex flex-col gap-3">
                        <p className="break-word font-medium text-sm ">
                          {note.content}
                        </p>

                        <div className="flex justify-between ">
                          <div className="flex gap-2 items-center">
                            <MdOutlineUpdate size={20} />
                            <h1 className="text-xs">
                              {format(note.createdAt, "MMMM-dd-yyyy")}
                            </h1>
                          </div>

                          <IoMdTrash
                            size={20}
                            onClick={(e) => removeNote(e, note._id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-1/2 bg-white rounded-lg hover:shadow-lg border overflow-auto relative">
              <div className="max-h-full">
                <div className="flex mb-3 border-b-2 px-5 pt-3 pb-2">
                  <div className="flex gap-2 items-center text-green-900 ">
                    <CgGoogleTasks size={20} />
                    <h1 className=" font-semibold 3xl:text-base text-sm">
                      Upcoming Tasks
                    </h1>
                    <h2 className="text-green-900 font-bold px-2 bg-slate-200 rounded-sm 3xl:text-base text-sm">
                      {tasks?.length}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3 px-5 ">
                  {tasks?.map((task, index) => (
                    <div
                      className="flex justify-between items-center border bg-slate-100 rounded-md pl-3 pr-6 py-3 gap-6 relative "
                      key={index}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1 items-center text-xs text-icons">
                          <p>Due:</p>
                          <IoIosCalendar size={17} />
                          <h1>{format(task.date, "MMMM-dd-yyyy")}</h1>
                        </div>
                        <p className="break-word font-medium text-green-900 text-sm">
                          {task.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        value={task.completed}
                        onChange={(e) =>
                          removeTask(e, task._id, e.target.checked)
                        }
                        className="appearance-none size-6 bg-slate-100 border rounded border-black checked:bg-green-900"
                      />
                      <span className="absolute right-0 bottom-0 h-full w-1.5 rounded-e-md bg-green-900 transition-transform transform "></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal refetch= {()=> refetch()} taskRefetch={() => taskRefetch()} />
        <div
          className={` ${
            toggle.editDetails ? "block" : "hidden"
          } w-full h-full bg-black opacity-70 absolute left-0 top-0 z-20`}
          onClick={() => dispatch(toggleEditDetails(false))}
        ></div>
      </div>
    </>
  );
};

export default WarmDetails;
