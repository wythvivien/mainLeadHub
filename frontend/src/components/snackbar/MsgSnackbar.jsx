import { MdClose, MdCheck, MdWarning } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { closeMsgSnackbar } from "../../app/features/snackbar";
import { useEffect } from "react";

const MsgSnackbar = () => {
  const dispatch = useDispatch();
  const { isOpen, message, type } = useSelector(
    (state) => state.snackbar.msgSnackbar
  );

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        dispatch(closeMsgSnackbar());
      }, 10000); // Close after 10 seconds (10000 milliseconds)

      return () => clearTimeout(timer); // Clear the timer if component unmounts or isOpen becomes false
    }
  }, [isOpen, dispatch]);

  return (
    isOpen && (
      <div className="z-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-between rounded-md drop-shadow-md bg-white border">
        <div className="flex gap-5">
          <div
            className={`${
              type === "success" ? "bg-green-900" : "bg-red-900"
            } flex items-center justify-center px-2.5 py-2.5 rounded-s-md`}
          >
            {type === "success" ? (
              <MdCheck className="size-5 text-white" />
            ) : (
              <MdWarning className="size-5 text-white" />
            )}
          </div>
          <p className="py-2.5 pr-20">{message}</p>
        </div>

        <div className="flex py-2.5 gap-1 items-center">
          <p className="border-r-2 px-2">Undo</p>
          <div className="flex justify-center items-center px-2 ">
            <MdClose
              onClick={() => dispatch(closeMsgSnackbar())}
              className="text-zinc-500 size-5"
            />
          </div>
        </div>
      </div>
    )
  );
};

export default MsgSnackbar;
