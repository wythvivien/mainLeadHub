import React, { useState, useEffect } from "react";
import TaskCard from "../../components/cards/TaskCard";
import { IoMdAdd } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  format,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  eachDayOfInterval,
  isSameMonth,
  getDay,
} from "date-fns";

import {
  useGetUserTasksQuery,
  useGetDateTasksQuery,
} from "../../app/api/calendarApiSlice";

import { toggleTaskForm } from "../../app/features/toggle";
import { useDispatch } from "react-redux";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Calendar = () => {
  const dispatch = useDispatch();

  const { data: tasks } = useGetUserTasksQuery();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: datedTasks, refetch} = useGetDateTasksQuery(date);

  const getDateTask = (day) => {
    setDate(format(day, "yyyy-MM-dd"));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const hasEvent = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return tasks?.some(
      (task) => format(task.date, "yyyy-MM-dd") === formattedDate
    );
  };

  useEffect(() => {
    console.log(datedTasks);
  }, [tasks, datedTasks, date]);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const startDate = subDays(firstDayOfMonth, firstDayOfMonth.getDay());
  const endDate = addDays(lastDayOfMonth, 6 - lastDayOfMonth.getDay());

  const daysInMonth = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return (
    <div className="h-full w-full bg-slate-100 px-8 py-10">
      <div className="h-full flex gap-5 relative">
        <div className="w-2/3 border-2 relative flex flex-col justify-between flex-wrap rounded-md bg-white p-7 ">
          <div className=" flex gap-24 justify-between items-center">
            <h1 className="text-base font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h1>
            <div className="flex gap-8">
              <FaChevronLeft onClick={goToPreviousMonth} size={14} />
              <FaChevronRight onClick={goToNextMonth} size={14} />
            </div>
          </div>
          <div>
            <div className="text-sm grid grid-cols-7 grid-rows-7 ">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-center font-semibold py-3 mb-4"
                >
                  {day.substring(0, 3)}
                </div>
              ))}

              {daysInMonth.map((day, index) => (
                <div
                  key={index}
                  className={`relative flex justify-center items-center border py-4 font-semibold ${
                    isSameMonth(day, currentDate)
                      ? " text-sidebar  hover:text-sidebar hover:bg-active hover:font-bold"
                      : "text-gray-300"
                  } ${
                    isSameMonth(day, currentDate) && hasEvent(day)
                      ? "after:h-1 after:w-3/5 after:absolute after:bg-sidebar after:bottom-2.5 after:rounded-md hover:after:bg-sidebar"
                      : ""
                  } ${
                    format(day, "yyyy-MM-dd") === date
                      ? "bg-active  text-sidebar after:bg-sidebar "
                      : ""
                  }`}
                  onClick={() => getDateTask(day)}
                >
                  {format(day, "d")}
                </div>
              ))}
            </div>
            <div className="text-sm flex justify-between mt-6">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="mm/yyyy"
                  className=" text-gray-400 border-2 px-3 py-1 rounded-l-sm outline-none"
                />
                <button className="text-gray-400 border-t-2 border-b-2 border-r-2 px-2 py-1 rounded-r-sm">
                  Go
                </button>
              </div>
              <button className="text-gray-400 border-2 px-2 py-1 rounded-sm">
                Today
              </button>
            </div>
          </div>
        </div>
        <div className="h-full border-2 relative flex flex-col rounded-md bg-white p-7 w-1/3">
          <div className="flex justify-between items-center ">
            <h1 className="text-lg font-semibold">
              {weekDays[getDay(new Date(date))]}
            </h1>
            <p className="text-sm font-semibold text-gray-500">
              {format(date, "MMMM dd yyyy")} 
            </p>
          </div>
          {datedTasks && datedTasks?.length > 0 ? (
            <div className="flex flex-col gap-3 items-center justify-start flex-grow overflow-y-auto my-3 pr-3 mb-12">
              {datedTasks?.map((task, index) => (
                <TaskCard task={task} key={index} refetch={() => refetch()} />
              ))}
            </div>
          ) : (
            <p className="flex items-center justify-center flex-grow mb-12 font-bold text-2xl">
              NO EVENTS
            </p>
          )}

          <button
            className="rounded-full p-2.5 bg-active absolute bottom-6 right-7"
            onClick={() => {
              dispatch(toggleTaskForm(true));
            }}
          >
            <IoMdAdd className=" size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
