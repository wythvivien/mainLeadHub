import DropDown from "../../components/dropdown/Dropdown";
import { TbDatabaseExport, TbSearch, TbDatabaseImport } from "react-icons/tb";
import { BiSort } from "react-icons/bi";
import { PiCardsBold, PiTableBold } from "react-icons/pi";
import { RiContactsBook2Fill } from "react-icons/ri";
import { sortOptions } from "../../data/menuList";
import DeadCard from "../../components/cards/DeadCard";
import DeadTable from "../../components/table/DeadTable";
import { toggleLeadForm } from "../../app/features/toggle";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const fetchLeads = async (pg, filter, sortBy, searchBy, sort_order, filterBy) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/leads/${pg || 1}/${filter || "Cold"}/${
        sortBy || "createdAt"
      }/${searchBy || "G"}/${sort_order || "desc"}/${filterBy || "Default"}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching leads:", error);
  }
}

const Dead = ({ setLeadVal, leads: leads2, refetch }) => {
  const [cardview, setCardView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("Recency");
  const [leads, setLeads] = useState(leads2);
  const [totalPages, setTotalPages] = useState(10);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const deadleads = leads.filter((lead) => lead.status === "Dead");

  const exportLeads = async () => {
    try {
      // Make a GET request to the server endpoint where exportAllLeads is defined
      const response = await fetch("http://localhost:8000/auth/export/deadleads", {
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
      a.download = "deadleads.csv"; // Set the filename for the downloaded file
      document.body.appendChild(a);

      // Click the anchor element to trigger the download
      a.click();

      // Cleanup: revoke the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting leads:", error);
    }
  };

  useEffect(() => {
    const sortBY = (() => {
      if (selectedSort === "Recency") {
        return "createdAt";
      } else if (selectedSort === "Logically") {
        return "account";
      } else {
        return "createdAt";
      }
    })()
    fetchLeads(
      page,
      'Dead',
      sortBY,
      searchQuery,
      "desc",
      "status",
    ).then((data) => {
      if (data) {
        setLeads(data);
      }
    }).catch((error) => {
      console.error("Error fetching leads:", error);
    });
  }, [page, selectedSort, searchQuery]);

  const filteredLeads = deadleads
    .sort((a, b) => {
      switch (selectedSort) {
        case "Logically":
          return a.account.localeCompare(b.account);
        case "Date":
          if (a.createdAt > b.createdAt) return -1;
          if (a.createdAt < b.createdAt) return 1;
          return a.account.localeCompare(b.account);
        default:
          if (a.updatedAt > b.updatedAt) return -1;
          if (a.updatedAt < b.updatedAt) return 1;
          return a.account.localeCompare(b.account);
      }
    })
    .filter((lead) =>
      lead.account.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    setLeadVal(filteredLeads.length);
  }, [leads, filteredLeads, setLeadVal]);

  return (
    <div className="flex flex-col px-6 pt-4 md:p-6 max-w-full h-full">
      <div className="flex h-fit justify-between mb-5">
        <div className="flex gap-8 items-center">
          <h1 className="hidden lg:flex items-center text-2xl font-semibold text-green-900">
            <span className="font-bold text-4xl">{filteredLeads.length}</span>
            &nbsp;Lead
            {filteredLeads.length === 1 ? "" : "s"}
          </h1>
          <div className="flex gap-3 xl:gap-5">
            <div className="flex gap-2 bg-white drop-shadow-md rounded-md px-2 lg:px-3 py-2 text-sm items-center justify-center">
              <TbSearch className="size-[18px] sm:size-5" />
              <input
                type="text"
                placeholder="Search Leads"
                className="outline-none border-none w-40"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropDown
              option={sortOptions}
              placeholder="Sort by"
              icon={BiSort}
              onChange={(selectedOption) => setSelectedSort(selectedOption)}
            />
          </div>
        </div>

        <div className=" flex gap-3 xl:gap-5">
          <div
            className="flex gap-2 bg-white drop-shadow-md rounded-md px-2 sm:px-3 lg:px-4 py-2 text-sm font-medium items-center justify-center cursor-pointer"
            onClick={() => {
              setCardView(!cardview);
            }}
          >
            {cardview ? (
              <PiCardsBold className="size-[18px] sm:size-5" />
            ) : (
              <PiTableBold
                className="size-[18px] sm:size-5"
                onClick={() => setCardView(false)}
              />
            )}
          </div>

          <div
            className="flex gap-2 bg-white drop-shadow-md rounded-md  px-2 sm:px-3 lg:px-4 py-2 text-sm font-medium items-center justify-center cursor-pointer"
            onClick={exportLeads}
          >
            <TbDatabaseExport className="size-[18px] sm:size-5" />
            <p className="hidden 2xl:block text-sm font-medium">Export</p>
          </div>

          <div
            className="flex gap-2 bg-green-900 drop-shadow-md rounded-md px-2 sm:px-3 lg:px-4 py-2 items-center cursor-pointer"
            onClick={() => dispatch(toggleLeadForm(true))}
          >
            <RiContactsBook2Fill
              color="white"
              className="size-[18px] sm:size-5"
            />
            <p className="hidden lg:block text-sm font-medium text-white">
              Create Lead
            </p>
          </div>
        </div>
      </div>

      <div className="w-full  flex-grow whitespace-nowrap ">
        {cardview ? (
          <div className="h-full py-5 overflow-auto">
            {filteredLeads.length > 0 ? (
              <DeadTable leads={filteredLeads} refetch={() => refetch()} />
            ) : (
              ""
            )}
          </div>
        ) : (
          <div className=" py-5 gap-2 md:gap-4 grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] overflow-y-auto">
            {filteredLeads.map((lead) => (
              <DeadCard key={lead._id} lead={lead} refetch={() => refetch()} />
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Stack spacing={6}>
          <Pagination
            onChange={(e, p) => setPage(p)}
            count={totalPages}
            variant="outlined"
            color="primary"
            size="large"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": { fontSize: "1.2rem" },
              "& .Mui-selected": { backgroundColor: "rgb(247, 209, 71)" },
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default Dead;
