import SubmitButton from "../../components/button/SubmitButton";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { useListLeadsQuery } from "../../app/api/leadsApiSlice";
import toggle, { toggleDealForm } from "../../app/features/toggle";
import { useDispatch, useSelector } from "react-redux";
import { BiChevronDown } from "react-icons/bi";
import { useCreateDealMutation } from "../../app/api/dealsApiSlice";

const StartDeal = () => {
  const [person, setPerson] = useState(null);
  const [createDeal] = useCreateDealMutation();
  const [open, setOpen] = useState(false);
  const [deal, setDeal] = useState({
    name: "",
    project: "",
    description: "",
    value: "",
    deadline: ""
  });

  const { data: leads } = useListLeadsQuery();
  const dealForm = useSelector((state) => state.toggle.dealForm);
  const dispatch = useDispatch();

  const warmleads = leads?.filter((lead) => lead.status === "Warm")

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createDeal(deal);
      toast("Updated Successfully");
      setDeal({
        name: "",
        project: "",
        description: "",
        value: "",
        deadline: "",
      });
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  return (
    <aside
      className={`${
        dealForm ? "block" : "hidden"
      } h-full w-screen sm:w-[370px] z-50 fixed top-0 right-0 bg-white drop-shadow-2xl overflow-y-auto`}
    >
      <MdClose
        className="size-6 absolute right-6 top-5 cursor-pointer"
        onClick={() => dispatch(toggleDealForm(false))}
      />
      <div className="border-b-4 p-6 mt-5">
        <h2 className="text-sm text-icons font-semibold">BUILD YOUR DEALS</h2>
        <h1 className="text-base font-bold">LEADS TO CONTRACTORS</h1>
      </div>
      <p className="px-6 py-4 text-sm text-icons">
        Once both sides have mutually agreed on a contract and all necessary
        needs are given. Create deals and fill up with details
      </p>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col px-6 gap-3 my-3">
          <div className="relative w-full font-medium text-sm">
            <div
              onClick={() => setOpen(!open)}
              className={`flex bg-stone-100 border rounded-sm px-2 py-1.5 text-sm items-center justify-between cursor-pointer ${
                !person && "text-gray-500"
              }`}
            >
              <span className="truncate">
                {person ? person : "Choose your contractor"}
              </span>
              <BiChevronDown size={20} className={`${open && "rotate-180"} `} />
            </div>
            <div
              className={` absolute z-10 bg-white border shadow-sm rounded-md mt-2 w-full overflow-y-auto max-h-60 right-0 ${
                open ? "block" : "hidden"
              }`}
            >
              <ul>
                {warmleads &&
                  warmleads?.map((lead, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setPerson(lead.account);
                        setOpen(false);
                        setDeal({ ...deal, name: lead.account})
                      }}
                      className="p-2 hover:bg-green-900 hover:text-white"
                    >
                      {lead.account}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 font-medium text-sm mt-4">
            <p className="text-[13px] font-semibold">Project Details</p>
            <input
              type="text"
              placeholder="Enter project title"
              value={deal.title}
              onChange={(e) => setDeal({ ...deal, project: e.target.value })}
              className="rounded-sm outline-none w-full bg-stone-100 border px-2 py-1"
            />
            <textarea
              placeholder="Enter project description..."
              value={deal.description}
              onChange={(e) => setDeal({ ...deal, description: e.target.value })}
              className="w-full border rounded-sm h-36   bg-stone-100 text-sm outline-none p-2"
            ></textarea>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[13px] font-semibold">Price Value</label>
              <input
                type="text"
                value={deal.value}
                placeholder="Enter payment price"
                onChange={(e) => setDeal({ ...deal, value: e.target.value })}
                className="bg-stone-100 text-sm outline-none px-2 py-1 border"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[13px] font-semibold">Deadline</label>
              <input
                type="date"
                value={deal.deadline}
                onChange={(e) => setDeal({ ...deal, deadline: e.target.value })}
                className="bg-stone-100 text-sm text-gray-500 outline-none px-2 py-1 border"
              />
            </div>
          </div>
        </div>
        <div className="flex px-6 justify-end mt-8 mb-5">
          <SubmitButton text="Create Deal" />
        </div>
      </form>
    </aside>
  );
};

export default StartDeal;
