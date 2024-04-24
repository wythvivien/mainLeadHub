import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "../sections/Sidebar";
import Header from "../sections/Header";
import Pipeline from "./tabs/Pipeline";
import Deals from "./tabs/Deals";
import WarmDetails from "./details/WarmDetails";
import Dashboard from "./tabs/Dashboard";
import Calendar from "./tabs/Calendar";
import Lead from "./tabs/Lead";
import MsgSnackbar from "../components/snackbar/MsgSnackbar";
import CreateLead from "../sections/forms/CreateLead";
import SendEmail from "../sections/forms/SendEmail";
import AddTask from "../sections/forms/AddTask";
import StartDeal from "../sections/forms/StartDeal";
import { useSelector } from "react-redux";
import { useReceiveEmailMutation } from "../app/api/usersApiSlice";
import { useNavigate } from "react-router-dom";

const LeadHub = () => {
  const [receiveEmail] = useReceiveEmailMutation();
  const navigate = useNavigate();

  //Toggling default of sidebar status based on windows screen
  useEffect(() => {
    receiveEmail();
    navigate("dashboard");
  }, []);

  const sidebar = useSelector((state) => state.toggle.sidebar);

  return (
    <>
      <Header />
      <SideBar />
      <CreateLead />
      <SendEmail />
      <AddTask />
      <StartDeal />
      <div className="max-w-full h-screen flex">
        <div
          className={`relative ml-0 w-full ${
            sidebar
              ? "md:ml-64 md:w-[calc(100%-224px) md:w-[calc(100%-256px)] "
              : "md:ml-20 md:w-[calc(100%-80px)]"
          } mt-16 h-[calc(100%-64px)] z-10`}
        >
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="deals" element={<Deals />} />
            <Route path="lead/*" element={<Lead />} />
            <Route path="lead/warm/:leadAccount" element={<WarmDetails />} />
            <Route path="lead/cold/:leadAccount" element={<WarmDetails />} />
            <Route path="lead/dead/:leadAccount" element={<WarmDetails />} />
            <Route path="calendar" element={<Calendar />} />
          </Routes>
          <MsgSnackbar />
        </div>
      </div>
    </>
  );
};

export default LeadHub;
