import { useState, useEffect } from "react";
import { useAddNotesMutation } from "../../../app/api/leadDetailsApiSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Notes = ({refetch}) => {
  const { leadAccount } = useParams();
  const [noteContent, setNoteContent] = useState({
    title: "",
    content: ""
  });
  const [addNotes] = useAddNotesMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await addNotes({ leadAccount, data: noteContent });
      toast("Updated Successfully");
      setNoteContent({
        title: "",
        content: "",
      });
      refetch();
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="w-full h-full">
        <div className="p-7 flex gap-2 flex-col">
          <label htmlFor="notes" className="text-xs font-semibold ">
            Note Taking
          </label>
          <input
            type="text"
            placeholder="Write note title"
            value={noteContent.title}
            onChange={(e) =>
              setNoteContent({ ...noteContent, title: e.target.value })
            }
            className="rounded-sm py-1 px-2  border bg-zinc-100 text-xs outline-none"
          />
          <textarea
            id="notes"
            autoComplete="off"
            value={noteContent.content}
            placeholder="Write your notes here"
            onChange={(e) =>
              setNoteContent({ ...noteContent, content: e.target.value })
            }
            className="w-96 h-36 rounded-sm p-2 border bg-zinc-100 text-xs outline-none resize-none"
          ></textarea>
        </div>
        <div className="bg-sidebar px-5 py-3 flex justify-end">
          <button
            className=" bg-active py-1.5 px-5 rounded-sm text-xs whitespace-nowrap font-semibold"
            onClick={submitHandler}
          >
            Add Notes
          </button>
        </div>
      </div>
    </>
  );
};

export default Notes;
