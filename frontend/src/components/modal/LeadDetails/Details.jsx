import { AiOutlineSwap } from "react-icons/ai";
import { TbTags } from "react-icons/tb";
import {
  useUpdateLeadDetailsMutation,
  useGetLeadQuery,
} from "../../../app/api/leadsApiSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Details = ({refetch}) => {
  const { leadAccount } = useParams();
  const [updateLead] = useUpdateLeadDetailsMutation();
  const [tag, setTag] = useState("");

  const [leadData, setLeadData] = useState({
    number: "",
    address: "",
    source: "",
    company: "",
    job: "",
    image: "",
    tags: [],
  });

  const handleAddTag = () => {
    if (tag.trim() !== "") {
      // Only add non-empty tags
      setLeadData({ ...leadData, tags: [...leadData.tags, tag.trim()] });
      setTag(""); // Clear the input field after adding the tag
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedFields = {};

      const fields = ["number", "address", "source", "company", "job", "image"];

      // Iterate over the fields array and check if each field in leadData is not empty
      fields.forEach((field) => {
        if (leadData[field] !== "") {
          updatedFields[field] = leadData[field];
        }
      });

      // Check if the address field is not empty and add it to the updatedFields object
      if (leadData.tags.length > 0) {
        updatedFields.tags = [...lead?.tags, ...leadData.tags];
      }

      // Calling the register mutation passing the data
      await updateLead({ leadAccount, data: updatedFields });
      toast("Updated Successfully");

      setLeadData({
        number: "",
        address: "",
        source: "",
        company: "",
        job: "",
        image: "",
        tags: [],
      });
      refetch();
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="p-7">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 pb-5 border-b-2">
            <div className="flex flex-col">
              <label htmlFor="number" className="text-xs font-semibold mb-1">
                Contact Number
              </label>

              <input
                id="number"
                type="text"
                autoComplete="off"
                value={leadData.number}
                onChange={(e) =>
                  setLeadData({ ...leadData, number: e.target.value })
                }
                className="w-full rounded-sm  px-3 py-1 border bg-zinc-100 text-xs outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="company" className="text-xs font-semibold mb-1">
                Company
              </label>

              <input
                id="company"
                type="text"
                autoComplete="off"
                value={leadData.company}
                onChange={(e) =>
                  setLeadData({ ...leadData, company: e.target.value })
                }
                className="w-full rounded-sm  px-3 py-1 border bg-zinc-100 text-xs outline-none"
              />
            </div>       

            <div className="col-span-2 flex flex-col">
              <label htmlFor="address" className="text-xs font-semibold mb-1">
                Address
              </label>

              <input
                id="address"
                type="text"
                autoComplete="off"
                className="w-full rounded-sm  px-3 py-1 border bg-zinc-100 text-xs outline-none"
                value={leadData.address}
                onChange={(e) =>
                  setLeadData({ ...leadData, address: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 flex flex-col">
              <label htmlFor="img" className="text-xs font-semibold mb-1">
                Picture Link
              </label>

              <div className="flex">
                <input
                  id="img"
                  type="text"
                  autoComplete="off"
                  value={leadData.image}
                  onChange={(e) =>
                    setLeadData({ ...leadData, image: e.target.value })
                  }
                  className=" flex-1 rounded-sm px-2 py-1 border bg-zinc-100 text-xs outline-none"
                />
                <div className="border border-green-900 bg-green-900 p-1 flex-none">
                  <AiOutlineSwap size={20} className="text-white" />
                </div>
              </div>
            </div>

            <label
              htmlFor="tag"
              className="text-xs font-semibold mb-1 col-span-2"
            >
              Tags
            </label>

            <div className="flex -mt-1">
              <input
                id="tags"
                type="text"
                autoComplete="off"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className=" rounded-sm  px-2 py-1 border bg-zinc-100 text-xs outline-none"
              />
              <div
                className="border border-green-900 bg-green-900 p-1 "
                onClick={handleAddTag}
              >
                <TbTags size={20} className="text-white" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center -mt-1 gap-2">
              {leadData.tags.length > 0 ? (
                leadData.tags.map((tag, index) => (
                  <p key={index} className="text-xs font-medium">
                    {tag}
                  </p>
                ))
              ) : (
                <p className="text-xs font-medium">No Tags Added</p>
              )}
            </div>
          </div>

          <p className="text-xs text-zinc-500 text-center py-3">
            Proceeding with these inputs will change the values <br></br>
            displayed on the lead information
          </p>
        </div>
        <div className="bg-sidebar px-5 py-3 flex justify-end">
          <button
            className=" bg-active py-1.5 px-5 rounded-sm text-xs whitespace-nowrap font-semibold"
            onClick={submitHandler}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Details;
