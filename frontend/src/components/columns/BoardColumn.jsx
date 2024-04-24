import { MdDeleteOutline } from "react-icons/md";
import BoardCard from "../cards/BoardCard";
import { Droppable, Draggable } from "react-beautiful-dnd";

const BoardColumn = ({ column, onDelete, refetch }) => {
  return (
    <>
      <div className="flex justify-between items-center drop-shadow-sm bg-white rounded-sm p-3 after:h-3/5 after:w-1 after:absolute after:bg-sidebar after:-left-0.5 after:rounded-md">
        <div className="flex gap-2 items-center">
          <h1 className="text-sm md:text-base font-semibold">{column.title}</h1>
          <p className="text-sidebar font-bold px-[5px] py-[1px] bg-slate-200 rounded-sm text-xs">
            {column.leads.length}
          </p>
          {column.leads.length > 0 && (
            <p className="text-sidebar font-bold px-2 py-[1px] bg-slate-200 rounded-sm text-xs">
              Value:{" "}
              {column.leads.reduce((total, lead) => total + lead.oppVal, 0)}
            </p>
          )}
        </div>

        <MdDeleteOutline
          size={20}
          className="cursor-pointer"
          onClick={() => onDelete()}
        />
      </div>

      <Droppable droppableId={column.title} direction="vertical" type="CARD">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-3 h-full overflow-y-auto "
          >
            {column.leads.map((lead, index) => (
              <Draggable
                key={lead._id}
                draggableId={lead._id}
                index={index}
                type="CARD"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <BoardCard leadId={lead} refetch={() => refetch()} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
};

export default BoardColumn;
