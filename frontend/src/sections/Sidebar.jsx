import { SiHandshakeProtocol } from "react-icons/si";
import { BiLogOut } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../app/features/toggle.js";
import { setActiveTab } from "../app/features/active.js";
import { Link } from "react-router-dom";
import { tabList } from "../data/menuList.js";
import { useLogoutMutation } from "../app/api/usersApiSlice.js";
import { useLoginQuery } from "../app/api/usersApiSlice.js";

const SideBar = () => {
  const sidebar = useSelector((state) => state.toggle.sidebar);
  const activeTab = useSelector((state) => state.active.activeTab);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const { data: user } = useLoginQuery();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "http://localhost:3000";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className={`${sidebar ? "block" : "hidden md:block"}`}>
      <div
        onClick={() => {
          dispatch(toggleSidebar());
        }}
        className="fixed md:hidden z-40 left-0 top-0 right-0 bottom-0 bg-slate-700 backdrop-blur-3xl opacity-60"
      ></div>
      <aside
        className={`h-screen z-40 fixed left-0 top-0 drop-shadow-2xl md:drop-shadow overflow-y-auto flex flex-col justify-between ${
          sidebar ? "w-64" : "w-20"
        } bg-sidebar py-5`}
      >
        <div>
          <div
            className={`w-full flex gap-3 cursor-pointer ${
              sidebar
                ? "lg:justify-start justify-center pr-4 lg:pr-0 lg:pl-8 pt-2"
                : "justify-center"
            } items-center`}
          >
            <SiHandshakeProtocol
              className={`text-active ${
                sidebar ? "size-9 lg:size-11" : "size-10"
              }`}
            />
            <h1
              className={`${
                sidebar ? "block" : "hidden"
              } text-2xl lg:text-[26px] leading-8 font-black tracking-tight text-white `}
            >
              LEADHUB
            </h1>
          </div>

          <div
            className={`w-full mt-5 lg:mt-8 py-5 px-4 ${
              sidebar ? "items-start gap-4" : "items-center gap-6"
            } flex flex-col relative`}
          >
            {tabList.map((c) => {
              return (
                <Link
                  to={`/leadhub/${c.link}`}
                  onClick={() => {
                    dispatch(setActiveTab(c.item));
                  }}
                  key={c.item}
                  className={`flex items-center gap-7 w-full rounded-lg self-stretch duration-300 cursor-pointer ${
                    sidebar ? "p-2 justify-start" : "p-1 justify-center"
                  } ${
                    activeTab === c.item
                      ? "bg-active bg-opacity-100 "
                      : "bg-transparent"
                  } `}
                >
                  <c.icon
                    className={`size-7 lg:size-8 ${
                      activeTab === c.item ? "text-sidebar" : "text-icons"
                    }`}
                  />
                  <span
                    className={`${sidebar ? "block" : "hidden"} ${
                      activeTab === c.item
                        ? "text-sidebar font-black"
                        : "text-white font-medium"
                    } lg:text-lg `}
                  >
                    {c.item}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div
          className={`${
            sidebar ? "px-5" : ""
          } hidden md:block items-center mt-5 py-2`}
        >
          <div
            className={` ${
              sidebar
                ? "gap-2 border-2 border-white w-full py-2 rounded-md "
                : "-ml-1"
            } flex items-center justify-center cursor-pointer`}
            onClick={() => handleLogout()}
          >
            <BiLogOut
              className={` ${sidebar ? "size-6" : "size-9"} text-white`}
            />
            <p
              className={` ${
                sidebar ? "block" : "hidden"
              } tracking-wide text-white`}
            >
              Logout
            </p>
          </div>
        </div>

        <div className="pl-5 flex md:hidden items-center  justify-between mt-5 py-2">
          <div className="flex gap-3 items-center ">
            <img
              src={user?.image}
              alt="User Profile"
              className="size-9 rounded-full object-cover border-sidebar"
            />
            <div className="flex flex-col w-3/5">
              <h2 className=" font-medium text-sm text-white">
                {user?.displayName}
              </h2>
              <p className="text-xs font-medium text-icons break-words truncate">
                {user?.email}
              </p>
            </div>
            <BiLogOut
              className="size-6 text-white"
              onClick={() => handleLogout()}
            />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
