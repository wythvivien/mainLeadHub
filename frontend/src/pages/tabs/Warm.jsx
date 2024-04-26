import DropDown from "../../components/dropdown/Dropdown";
import { TbDatabaseExport, TbSearch, TbDatabaseImport } from "react-icons/tb";
import { BiFilterAlt, BiSort } from "react-icons/bi";
import { PiCardsBold, PiTableBold } from "react-icons/pi";
import { RiContactsBook2Fill } from "react-icons/ri";
import { sortOptions } from "../../data/menuList";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  useUpdateLeadColumnMutation,
} from "../../app/api/leadsApiSlice";
import { useListColumnQuery } from "../../app/api/columnApiSlice";
import { useUpdateColumnMutation } from "../../app/api/columnApiSlice";
import WarmCard from "../../components/cards/WarmCard";
import WarmTable from "../../components/table/WarmTable";
import { useDispatch } from "react-redux";
import { openMsgSnackbar } from "../../app/features/snackbar";
import { toggleLeadForm } from "../../app/features/toggle";
import { useEffect, useState } from "react";
import {fetchLeadCount, fetchLeads} from "./helpers";


const Warm = ({ setLeadVal, leads: leads2, refetch }) => {
  const { data: columnOptions, refetch: listRefetch } = useListColumnQuery();
  const [updateColumn] = useUpdateColumnMutation();
  const [updateLeadColumn] = useUpdateLeadColumnMutation();
  const [cardview, setCardView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Default");
  const [selectedSort, setSelectedSort] = useState("Recency");
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [leads, setLeads] = useState(leads2);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const warmleads = leads.filter((lead) => lead.status === "Warm");

  const exportLeads = async () => {
    try {
      // Make a GET request to the server endpoint where exportAllLeads is defined
      const response = await fetch("http://localhost:8000/auth/export/warmleads", {
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
      a.download = "warmleads.csv"; // Set the filename for the downloaded file
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

    fetchLeadCount("Warm").then((data) => {
      if (data) {
        setTotalPages(data.pageCount);
        setTotalCount(data.totalCount)
      }
    }).catch((error) => {
      console.error("Error fetching leads:", error);
    });
      
      fetchLeads(page, "Warm", sortBY, searchQuery, "desc", "status")
        .then((data) => {
          if (data) {
            setLeads(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching leads:", error);
        });
  }, [page, selectedFilter, selectedSort, searchQuery]);

  const filteredLeads = warmleads
    .filter((lead) =>
      selectedFilter !== "Default" ? lead.column === selectedFilter : true
    )
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
    setLeadVal(filteredLeads?.length);
  }, [filteredLeads]);

  useEffect(() => {
    listRefetch();
  }, []);

  const updateHandler = async (id) => {
    try {
      await updateColumn({ title: "New", leadId: id });
      await updateLeadColumn({ title: "New", leadId: id });
      refetch();
      dispatch(
        openMsgSnackbar({ message: "Successfully Updated", type: "success" })
      );
    } catch (err) {
      dispatch(
        openMsgSnackbar({
          message: "There is an error in the system",
          type: "error",
        })
      );
    }
  };
;


  return (
    <div className="flex flex-col px-6 pt-4 md:p-6 max-w-full h-full ">
      <div className="flex flex-col-reverse md:flex-row gap-3 h-fit justify-between mb-5">
        <div className="flex gap-8 items-center">
          <h1 className="hidden lg:flex items-center text-2xl font-semibold text-green-900">
            <span className="font-bold text-4xl">{totalCount}</span>
            &nbsp;Lead
            {totalCount === 1 ? "" : "s"}
          </h1>
          {
            <div className="flex w-full md:w-fit justify-between gap-2 xl:gap-5">
              <div className="flex gap-2 bg-white drop-shadow-md rounded-md px-2 lg:px-3 py-2 text-sm items-center justify-center">
                <TbSearch className="size-[18px] sm:size-5" />
                <input
                  type="text"
                  placeholder="Search Leads"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none border-none w-48 md:w-32"
                />
              </div>
              <div className="flex gap-2 lg:gap-5">
                <DropDown
                  option={columnOptions}
                  placeholder="Status"
                  icon={BiFilterAlt}
                  onChange={(selectedOption) =>
                    setSelectedFilter(selectedOption)
                  }
                />
                <DropDown
                  option={sortOptions}
                  placeholder="Sort by"
                  icon={BiSort}
                  onChange={(selectedOption) => setSelectedSort(selectedOption)}
                />
              </div>
            </div>
          }
        </div>

        <div className="flex justify-between gap-3 xl:gap-5">
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
          <div className="flex gap-3 xl:gap-5 ">
            {/* <div className="flex">
              <div className="flex gap-2 bg-white drop-shadow-md rounded-s-md rounded-y-md px-2 sm:px-3 lg:px-4 py-2 text-sm font-medium items-center justify-center cursor-pointer">
                <TbDatabaseImport className="size-[18px] sm:size-5" />
                <p className="hidden 2xl:block text-sm font-medium">Import</p>
              </div> */}
              <div className="flex gap-2 bg-white drop-shadow-md rounded-md px-2 sm:px-3 lg:px-4 py-2 text-sm font-medium items-center justify-center cursor-pointer" onClick={exportLeads}>
                <TbDatabaseExport className="size-[18px] sm:size-5" />
                <p className="hidden 2xl:block text-sm font-medium">Export</p>
              </div>
            {/* </div> */}

            <div
              className="flex gap-2 bg-green-900 drop-shadow-md rounded-md px-2 sm:px-3 lg:px-4 py-2 items-center cursor-pointer"
              onClick={() => dispatch(toggleLeadForm(true))}
            >
              <RiContactsBook2Fill
                color="white"
                className="size-[18px] sm:size-5"
              />
              <p className="block md:hidden lg:block text-sm font-medium text-white">
                Create Lead
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-grow whitespace-nowrap ">
        {cardview ? (
          <div className="h-full py-5 overflow-auto ">
            {filteredLeads.length > 0 ? (
              <WarmTable leads={filteredLeads} refetch={() => refetch()} />
            ) : (
              ""
            )}
          </div>
        ) : (
          <div
            className="py-5 gap-2 md:gap-4 grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] overflow-y-auto"
            
          >
            {filteredLeads.map((lead) => (
              <WarmCard
                key={lead._id}
                lead={lead}
                onUpdate={() => updateHandler(lead._id)}
                refetch={() => refetch()}
              />
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
              "& .Mui-selected": { backgroundColor: "rgb(247, 209, 71) !important" },
            }}
          />
        </Stack>
      </div>
    </div>
  );
};

export default Warm;