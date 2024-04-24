import FormInput from "../../components/inputs/FormInput";
import SubmitButton from "../../components/button/SubmitButton";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { toggleLeadForm } from "../../app/features/toggle";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useCreateLeadMutation } from "../../app/api/leadsApiSlice";

const CreateLead = () => {
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    number: "",
    status: "",
    source: ""
  });

  const [createLead] = useCreateLeadMutation();

  const leadForm = useSelector((state) => state.toggle.leadForm);
  const dispatch = useDispatch();

  // Form Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Calling the register mutation passing the data
      await createLead(leadData);
      setLeadData({
        name: "",
        email: "",
        number: "",
        status: "",
        source: ""
      });
      toast("Lead Created Successfully");
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  return (
    <aside
      className={`${
        leadForm ? "block" : "hidden"
      } h-full w-screen sm:w-[370px] z-50 fixed top-0 right-0 bg-white drop-shadow-2xl`}
    >
      <MdClose
        className="size-6 absolute right-6 top-5 cursor-pointer"
        onClick={() => dispatch(toggleLeadForm(false))}
      />
      <div className="border-b-4 p-6 mt-5">
        <h2 className="text-sm text-icons font-semibold">CREATING LEADS</h2>
        <h1 className="text-base font-bold">INPUT BUSINESS PROSPECTS</h1>
      </div>
      <p className="px-6 py-4 text-sm text-icons">
        Send your commitment and grab your opportunity by outreaching to
        multiple possible prospects. Leads that are outreached
      </p>

      <form onSubmit={submitHandler}>
        <div className="flex flex-col gap-5 px-6 my-3">
          <FormInput
            item="Full Name"
            value={leadData.name}
            onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
          />
          <FormInput
            item="Email Address"
            value={leadData.email}
            onChange={(e) =>
              setLeadData({ ...leadData, email: e.target.value })
            }
          />
          <FormInput
            item="Contact Number"
            value={leadData.number}
            onChange={(e) =>
              setLeadData({ ...leadData, number: e.target.value })
            }
          />
          <FormInput
            item="Lead Status"
            value={leadData.status}
            onChange={(e) =>
              setLeadData({ ...leadData, status: e.target.value })
            }
          />

          <FormInput
            item="Lead Source"
            value={leadData.source}
            onChange={(e) =>
              setLeadData({ ...leadData, source: e.target.value })
            }
          />
        </div>
        <div className="flex px-6 justify-end mt-8">
          <SubmitButton text="Confirm" />
        </div>
      </form>
    </aside>
  );
};

export default CreateLead;
