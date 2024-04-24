import React from "react";
import { useGetLeadDetailsQuery } from "../../app/api/calendarApiSlice";

const TaskCard = ({ task }) => {
  const { data: lead } = useGetLeadDetailsQuery(task.lead);

  return (
    <div
      className="flex flex-col justify-center border-2 rounded-lg px-3 py-2 w-full gap-2"
      onClick={() => console.log(lead)}
    >
      <div className="flex justify-between items-center">
        <div className="flex-col">
          <h1 className="text-sm font-semibold">{task.description}</h1>
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
        />
      </div>
      <div className="flex justify-between items-center border-t-2 pt-1.5">
        <h1 className="text-xs font-medium text-gray-400">Event: 3:00 PM</h1>
        <img src={lead?.image} alt="" className="size-5 border rounded-full" />
      </div>
    </div>
  );
};

export default TaskCard;
