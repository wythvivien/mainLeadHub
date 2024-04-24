import { useEffect, useState } from "react";
import {
  useGetAllColumnQuery,
  useCreateColumnMutation,
  useUpdColumnPosMutation,
  useUpdColumnLeadMutation,
  useDeleteColumnMutation,
} from "../../app/api/columnApiSlice";
import { useUpdateLeadColumnMutation } from "../../app/api/leadsApiSlice";
import { toast } from "react-toastify";
import BoardColumn from "../../components/columns/BoardColumn";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TbFreezeColumn, TbDatabaseExport, TbSearch } from "react-icons/tb";
import DropDown from "../../components/dropdown/Dropdown";
import { useDispatch } from "react-redux";
import { openMsgSnackbar } from "../../app/features/snackbar";
import { BiFilterAlt, BiSort } from "react-icons/bi";
import { useListColumnQuery } from "../../app/api/columnApiSlice";

const Pipeline = () => {
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Default");
  const [selectedSort, setSelectedSort] = useState("Recency");
  const [columnArray, setColumnArray] = useState([]);
  const { data: columns, refetch } = useGetAllColumnQuery();
  const { data: columnOptions, refetch: listRefetch } = useListColumnQuery();
  const [createColumn] = useCreateColumnMutation();
  const [updColumnPos] = useUpdColumnPosMutation();
  const [updColumnLead] = useUpdColumnLeadMutation();
  const [updateLeadCol] = useUpdateLeadColumnMutation();
  const [deleteColumn] = useDeleteColumnMutation();
  const [open, setOpen] = useState(false);

  const exportColumn = async () => {
    try {
      // Make a GET request to the server endpoint where exportAllLeads is defined
      const response = await fetch("http://localhost:8000/auth/export/columns", {
        method: "GET", // Or "POST", "PUT", etc. depending on your server endpoint
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json", // Set content type header
          // Add any other headers if needed
        },
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error("Failed to export leads");
      }

      // Read the response body as a Blob
      const blob = await response.blob();

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = "columns.csv"; // Set the filename for the downloaded file
      document.body.appendChild(a);

      // Click the anchor element to trigger the download
      a.click();

      // Cleanup: revoke the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting leads:", error);
    }
  };

  const dispatch = useDispatch();

  const sortOptions = ["Logically", "Recency", "Value", "Default"];

  useEffect(() => {
    // Create a default column if no columns exist
    if (columns?.length === 0) {
      createColumn({ title: "New", position: 0 }).then(refetch);
    }

    const sortedColumns = [...(columns || [])].sort(
      (a, b) => a.position - b.position
    );
    setColumnArray(sortedColumns);
    refetch();
    console.log("lol");
  }, [columns, refetch, listRefetch]);

  const filteredColumns = columnArray
    .filter((column) => {
      // Check if selectedFilter is not "Default" and column title matches selectedFilter
      const filterCondition =
        selectedFilter !== "Default" ? column.title === selectedFilter : true;

      // Check if there is a search query and any lead in the column matches the search query
      const searchCondition = searchQuery
        ? column.leads.some((lead) =>
            lead.account.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;

      // Combine both conditions using logical AND operator
      return filterCondition && searchCondition;
    })
    .map((column) => {
      // Filter the leads within the column based on the search query
      const filteredLeads = column.leads.filter((lead) =>
        lead.account.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...column,
        leads: filteredLeads.slice(), // Create a shallow copy to avoid mutating the original array
      };
    });

  // Check if sorting is not "Default" and there are columns with leads
  if (
    selectedSort !== "Default" &&
    filteredColumns.some((column) => column.leads.length > 0)
  ) {
    filteredColumns.forEach((column) => {
      column.leads.sort((a, b) => {
        switch (selectedSort) {
          case "Logically":
            return a.account.localeCompare(b.account);
          case "Value":
            if (a.oppVal > b.oppVal) return -1;
            if (a.oppVal < b.oppVal) return 1;
            return a.account.localeCompare(b.account);
          default:
            if (a.updatedAt > b.updatedAt) return -1;
            if (a.updatedAt < b.updatedAt) return 1;
            return a.account.localeCompare(b.account);
        }
      });
    });
  }

  // Now, perform sorting on the filtered leads separately

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createColumn({ title, position: columns?.length });
      dispatch(
        openMsgSnackbar({ message: "New column is added", type: "success" })
      );
      setTitle("");
      refetch();
    } catch (err) {
      dispatch(openMsgSnackbar({ message: err, type: "error" }));
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteColumn(id);
      refetch();
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  const handleDragEnd = async (results) => {
    console.log(results);
    const { source, destination, type, draggableId } = results;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    if (type === "COLUMN") {
      const reorderedColumns = [...columnArray];

      const [removedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, removedColumn);

      setColumnArray(reorderedColumns);

      for (let i = 0; i < reorderedColumns.length; i++) {
        await updColumnPos({ title: reorderedColumns[i].title, position: i });
      }
      await refetch();
    }

    if (type === "CARD") {
      const colSource = columnArray?.findIndex(
        (column) => column.title === source.droppableId
      );
      const colDestination = columnArray?.findIndex(
        (column) => column.title === destination.droppableId
      );

      const newSourceLeads = [...columnArray[colSource].leads];
      const newDestinationLeads =
        source.droppableId !== destination.droppableId
          ? [...columnArray[colDestination].leads]
          : newSourceLeads;

      const [deletedItem] = newSourceLeads.splice(source.index, 1);
      newDestinationLeads.splice(destination.index, 0, deletedItem);

      const newColumns = [...columnArray];

      newColumns[colSource] = {
        ...columnArray[colSource],
        leads: newSourceLeads,
      };
      newColumns[colDestination] = {
        ...columnArray[colDestination],
        leads: newDestinationLeads,
      };
      setColumnArray(newColumns);

      try {
        await Promise.all([
          updColumnLead({
            title: columnArray[colSource].title,
            leads: newSourceLeads,
          }),
          updColumnLead({
            title: columnArray[colDestination].title,
            leads: newDestinationLeads,
          }),
          updateLeadCol({
            title: destination.droppableId,
            leadId: draggableId,
          }),
        ]);
        // Optionally, you can trigger a refetch to update the UI
        refetch();
      } catch (err) {
        // Handle errors
        console.error("Error updating leads in the database", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full py-5 bg-slate-100 min-w-full">
      <div className="flex flex-col gap-5 border-b-2 h-fit w-full relative px-6 pb-5">
        <h1 className="hidden md:block font-semibold text-green-900 text-2xl">
          Pipeline
        </h1>
        <div className="flex justify-between items-center">
          <div className="flex gap-3 lg:gap-5">
            <div className="flex gap-2 bg-white drop-shadow-md rounded-md px-2 lg:px-3 py-2 text-sm items-center justify-center">
              <TbSearch size={20} color="gray" />
              <input
                type="text"
                className="hidden sm:block outline-none border-none w-40"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Leads"
              />
            </div>
            <DropDown
              option={columnOptions}
              placeholder="Column"
              icon={BiFilterAlt}
              onChange={(selectedOption) => setSelectedFilter(selectedOption)}
            />
            <DropDown
              option={sortOptions}
              placeholder="Sort by"
              icon={BiSort}
              onChange={(selectedOption) => setSelectedSort(selectedOption)}
            />
          </div>

          <div className=" flex gap-3 lg:gap-5 relative">
            <div className="flex gap-2 bg-white drop-shadow-md rounded-md px-3 lg:px-4 py-2 text-sm font-medium items-center justify-center" onClick={exportColumn}>
              <TbDatabaseExport size={20} />
              <p className="hidden lg:block text-sm font-medium">Export</p>
            </div>

            <div
              className="flex gap-2 bg-green-900 drop-shadow-md rounded-md px-3 lg:px-4 py-2 items-center"
              onClick={() => setOpen(!open)}
            >
              <TbFreezeColumn color="white" size={20} />
              <p className="hidden lg:block text-sm font-medium text-white">
                Add Section
              </p>
            </div>
            {open && (
              <div className=" z-10 absolute flex right-0 top-12 h-fit rounded-md ">
                <input
                  type="text"
                  className="w-44 text-sm outline-none px-3 py-2 border-l-2 border-y-2 rounded-s-md"
                  placeholder="Enter Section"
                  autoComplete="off"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button
                  className="bg-green-900 text-white py-2 px-3 text-sm font-medium outline-none rounded-e-md"
                  onClick={submitHandler}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 gap-5 mt-5 h- px-6 overflow-x-auto whitespace-nowrap">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
            {(provided) => (
              <div
                className="flex gap-5"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredColumns?.map((column, index) => (
                  <Draggable
                    key={column.title}
                    draggableId={column.title}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="min-w-80 flex flex-col gap-3"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <BoardColumn
                          column={column}
                          onDelete={() => deleteHandler(column._id)}
                          refetch={() => refetch()}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Pipeline;
