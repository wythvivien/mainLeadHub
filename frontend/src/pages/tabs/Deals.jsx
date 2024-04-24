import { useEffect, useState } from "react";
import { TbFreezeColumn, TbDatabaseExport, TbSearch } from "react-icons/tb";
import {
  useRetrieveDealsQuery,
  useCompleteDealMutation,
} from "../../app/api/dealsApiSlice";
import { useDispatch } from "react-redux";
import { toggleDealForm } from "../../app/features/toggle.js";
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

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: deals, refetch } = useRetrieveDealsQuery();
  const [completeDeal] = useCompleteDealMutation();
  const dispatch = useDispatch();

  const exportDeals = async () => {
    try {
      // Make a GET request to the server endpoint where exportAllLeads is defined
      const response = await fetch("http://localhost:8000/auth/export/deals", {
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
      a.download = "deals.csv"; // Set the filename for the downloaded file
      document.body.appendChild(a);

      // Click the anchor element to trigger the download
      a.click();

      // Cleanup: revoke the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting leads:", error);
    }
  };

  const filteredDeals = deals?.sort((a, b) => {
      if (a.deadline > b.deadline) return -1;
      if (a.deadline < b.deadline) return 1;
    })
    .filter(
      (deal) =>
        deal.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex flex-col h-full py-5 bg-slate-100 min-w-full">
      <div className="flex flex-col gap-5 h-fit border-b-2 w-full relative px-6 pb-5">
        <h1 className="hidden md:block font-semibold text-green-900 text-2xl">
          Deals
        </h1>
        <div className="flex items-center gap-5">
          <div className="flex gap-2 bg-white drop-shadow-md rounded-md px-2 lg:px-3 py-2 text-sm items-center justify-center">
            <TbSearch size={20} color="gray" />
            <input
              type="text"
              className=" outline-none border-none"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Leads"
            />
          </div>
          <div className="flex gap-2 bg-white drop-shadow-md rounded-md px-3 lg:px-4 py-2 text-sm font-medium items-center justify-center" onClick={exportDeals}>
            <TbDatabaseExport size={20} />
            <p className="hidden md:block text-sm font-medium">Export</p>
          </div>
          <div
            className="flex gap-2 bg-green-900 drop-shadow-md rounded-md px-3 lg:px-4 py-2 items-center cursor-pointer"
            onClick={() => dispatch(toggleDealForm(true))}
          >
            <TbFreezeColumn color="white" size={20} />
            <p className="hidden md:block text-sm font-medium text-white">
              Create Deal
            </p>
          </div>
        </div>
      </div>
      <div className="flex-grow w-full whitespace-nowrap px-6 py-4 ">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] grid-flow-row-dense auto-rows-[minmax(220px,auto)] gap-7">
          {filteredDeals?.map((deal, index) => (
            <div className="border-2 flex flex-col rounded-lg p-4 bg-white" key={index}>
              <div className="flex justify-between items-start mb-3">
                <img
                  src={deal.image}
                  alt=""
                  className="size-12 rounded-full border"
                />
                <button
                  className="bg-zinc-200 px-4 py-1.5 rounded-sm text-xs font-medium"
                  onClick={async () => {
                    await completeDeal({
                      dealId: deal._id,
                      boolean: !deal.completed,
                    });
                    refetch();
                  }}
                >
                  {deal.completed ? "Completed" : "Ongoing"}
                </button>
              </div>
              <h1 className="font-semibold text-lg truncate">{deal.project}</h1>
              <p className="flex-grow text-sm font-medium text-gray-500 whitespace-normal truncate mb-5">
                {deal.description}
              </p>
              <p className="font-medium text-gray-500 flex justify-end text-sm mb-5">
                {capitalizeName(deal.name)}
              </p>
              <div className="flex justify-between">
                <div className="flex gap-1 font-semibold text-gray-500 text-sm">
                  <p>Value:</p>
                  <p>P{deal.value}</p>
                </div>
                <div className="flex gap-1 font-semibold text-gray-500 text-sm">
                  <p>Deadline:</p>
                  <p>{format(deal.deadline, "MM-dd-yy")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deals;
