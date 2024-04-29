import React, { useEffect, useState } from "react";
import { useDeleteTaskDetailsMutation, useGetLeadDetailsQuery, useUpdateTaskDetailsMutation } from "../../app/api/calendarApiSlice";
import { MdDelete, MdEdit } from "react-icons/md";
import { toggleTaskForm } from "../../app/features/toggle";
import { useDispatch } from "react-redux";



const TaskCard = ({ task, key, refetch }) => {
 const dispatch = useDispatch();
 const { data: lead } = useGetLeadDetailsQuery(task.lead);
 const [isChecked, setIsChecked] = useState(false);
 const [showFullDescription, setShowFullDescription] = useState(false); 
 const [updateTask] = useUpdateTaskDetailsMutation();
 const [deleteTask] = useDeleteTaskDetailsMutation();

  useEffect(() => {
    setIsChecked(task.completed);
  }, [task]);

 const handleCheckboxChange = (e) => {
    e.preventDefault();
    updateTask({ taskId: task._id, completed: !isChecked }).then(() => {
      refetch();
    });
    setIsChecked(!isChecked);
    
 };

 const toggleDescriptionVisibility = () => {
    setShowFullDescription(!showFullDescription);
 };

 const onDelete = (task) => {
  deleteTask({ taskId: task._id }).then(() => {
    refetch();
  });
 
}

 

 return (
    <div
      className="flex flex-col justify-center border-2 rounded-lg px-3 py-2 w-full gap-2 bg-gradient-to-r from-primary-100 to-primary-200"
      onClick={() => console.log(lead)}
    >
      <div className="flex justify-between items-center">
        <div className="flex-col ">
          <h1 className="text-sm font-semibold" style={{ textDecoration: isChecked ? 'line-through' : 'none' }}>{task.title}</h1>
          {lead?.company ? (
            <h2 className="text-xs text-gray-400 font-medium">
              {lead?.company}
            </h2>
          ) : (
            ""
          )}
        </div>
        <input
          type="checkbox"
          className="appearance-none size-5 bg-slate-100 border rounded-full border-black checked:bg-active"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="flex justify-between items-center border-t-2 pt-1.5" onClick={toggleDescriptionVisibility}>
        {showFullDescription ? (
          <h1 className="text-sm font-medium text-gray-600">{task.description}</h1>
        ) : (
          <h1 className="text-sm font-medium text-gray-600 truncate w-full whitespace-nowrap">{task.description}</h1>
        )}
      </div>
      <div className="flex justify-between items-center border-t-2 pt-1.5">
        <h1 className="text-xs font-medium text-gray-400">{task.time}</h1>
        <img src={lead?.image} alt="" className="size-5 border rounded-full" />
        
      </div>
      <div className="">
        <button onClick={() => {
              dispatch(toggleTaskForm({payload: true, task: task}));
            }}>
          <MdEdit />
        </button>
        <button onClick={() => onDelete(task)}>
          <MdDelete />
        </button>
      </div>
    </div>
 );
};

export default TaskCard;
