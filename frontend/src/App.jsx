import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signin from "./pages/Signin";
import LeadHub from "./pages/LeadHub";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/leadhub/*" element={<LeadHub />} />
      </Routes>
    </>
  );
};

export default App;
