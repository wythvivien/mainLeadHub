import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllLeadsQuery } from "../../app/api/leadsApiSlice";
import { BiChevronDown } from "react-icons/bi";
import Warm from "./Warm";
import Cold from "./Cold";
import Dead from "./Dead";
import AllLeads from "./AllLeads";

const Lead = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { data: leads, refetch } = useGetAllLeadsQuery();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [leadVal, setLeadVal] = useState(0);

  const option = ["All Leads", "Warm Leads", "Cold Leads", "Dead Leads"];

  useEffect(() => {
    navigate(activeTab);
  }, [leads]);

  useEffect(() => {
    refetch();
  }, [])

  const pluralize = (count) => (count === 1 ? " Lead" : " Leads");

  return (
    <div className="flex flex-col min-w-full min-h-full bg-slate-100">
      <div className="flex justify-between items-center lg:hidden h-16 w-full pt-2 px-6 relative">
        <h1 className="flex lg:hidden items-center text-2xl font-semibold text-green-900">
          <span className="font-bold text-4xl">{leadVal}</span>
          &nbsp;
          {pluralize(leadVal)}
        </h1>
        <div className="relative w-36 font-medium text-sm">
          <div
            onClick={() => setOpen(!open)}
            className="flex bg-green-900 drop-shadow-md rounded-md px-3 py-2 text-sm items-center justify-between cursor-pointer"
          >
            <span className="truncate text-white">{activeTab} Leads</span>
            <BiChevronDown
              size={20}
              color="white"
              className={`${open && "rotate-180"}`}
            />
          </div>
          <div
            className={`absolute z-10 bg-white drop-shadow-md rounded-md mt-2 w-full overflow-y-auto max-h-60 right-0 ${
              open ? "block" : "hidden"
            }`}
          >
            <ul className="flex flex-col">
              {option.map((lead) => (
                <Link
                  to={lead.split(" ")[0].toLowerCase()}
                  key={lead}
                  onClick={() => {
                    setActiveTab(lead.split(" ")[0]);
                    setOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-green-900 hover:text-white"
                >
                  {lead}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="hidden lg:block border-b-2 h-16 w-full px-6 pt-2 relative">
        <ul className="flex justify-center lg:justify-start gap-6 h-full">
          {option.map((lead) => (
            <li className="flex items-center px-3 relative" key={lead}>
              <Link
                to={lead.split(" ")[0].toLowerCase()}
                onClick={() => setActiveTab(lead.split(" ")[0])}
                className={`font-bold ${
                  activeTab === lead.split(" ")[0]
                    ? "text-green-900"
                    : "text-sidebar"
                } text-lg flex gap-2`}
              >
                {lead.toUpperCase()}
              </Link>
              {activeTab === lead.split(" ")[0] && (
                <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-active transition-transform transform -translate-y-1/2"></span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex max-w-full flex-grow">
        <div className="w-full flex-grow">
          <Routes>
            <Route
              path="all"
              element={
                <AllLeads
                  setLeadVal={setLeadVal}
                  leads={leads || []}
                  refetch={() => refetch()}
                />
              }
            />
            <Route
              path="warm"
              element={
                <Warm
                  setLeadVal={setLeadVal}
                  leads={leads || []}
                  refetch={() => refetch()}
                />
              }
            />
            <Route
              path="cold"
              element={
                <Cold
                  setLeadVal={setLeadVal}
                  leads={leads || []}
                  refetch={() => refetch()}
                />
              }
            />
            <Route
              path="dead"
              element={
                <Dead
                  setLeadVal={setLeadVal}
                  leads={leads || []}
                  refetch={() => refetch()}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Lead;
