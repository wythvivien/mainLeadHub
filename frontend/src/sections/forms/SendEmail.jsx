import FormInput from "../../components/inputs/FormInput";
import SubmitButton from "../../components/button/SubmitButton";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import { toggleEmailForm } from "../../app/features/toggle";
import { useDispatch, useSelector } from "react-redux";

import { useSendEmailMutation } from "../../app/api/usersApiSlice";

const SendEmail = () => {
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    text: "",
  });

  const [sendEmail] = useSendEmailMutation();

  const emailForm = useSelector((state) => state.toggle.emailForm);
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Calling the register mutation passing the data
      await sendEmail(emailData);
      setEmailData({
        recipient: "", 
        subject: "",
        text: "",
      });
      toast("Email Sent Successfully");
    } catch (err) {
      toast(err?.data?.message || err.error);
    }
  };

  return (
    <aside
      className={`${
        emailForm ? "block" : "hidden"
      } h-full w-screen sm:w-[370px] z-50 fixed top-0 right-0 bg-white drop-shadow-2xl`}
    >
      <MdClose
        className="size-6 absolute right-6 top-5 cursor-pointer"
        onClick={() => dispatch(toggleEmailForm(false))}
      />
      <div className="border-b-4 p-6 mt-5">
        <h2 className="text-sm text-icons font-semibold">OUTREACHING</h2>
        <h1 className="text-base font-bold">FINDING BUSINESS PROSPECTS</h1>
      </div>
      <p className="px-6 py-4 text-sm text-icons">
        Send your commitment and grab your opportunity by outreaching to
        multiple possible prospects. Leads that are outreached are directly
        transferred to repository
      </p>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col gap-3 px-6 my-3">
          <FormInput
            item="Subject"
            value={emailData.subject}
            onChange={(e) =>
              setEmailData({ ...emailData, subject: e.target.value })
            }
          />
          <FormInput
            item="Recipient Email Address"
            value={emailData.recipient}
            onChange={(e) =>
              setEmailData({ ...emailData, recipient: e.target.value })
            }
          />
          <textarea
            placeholder="Enter your message..."
            value={emailData.text}
            onChange={(e) =>
              setEmailData({ ...emailData, text: e.target.value })
            }
            className="w-full border rounded-sm h-60 bg-stone-100 text-sm outline-none px-1.5 py-1.5 focus:outline-active my-3"
          ></textarea>
        </div>
        <div className="flex px-6 justify-end mt-3">
          <SubmitButton text="Forward" />
        </div>
      </form>
    </aside>
  );
};

export default SendEmail;
