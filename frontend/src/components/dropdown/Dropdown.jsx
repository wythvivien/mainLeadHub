import {useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const DropDown = ({ option, placeholder, icon: IconComponent, onChange }) => {
  const [item, setItem] = useState(null);
  const [open, setOpen] = useState(false);

  const handleItemClick = (selectedItem) => {
    setItem(selectedItem);
    setOpen(false);
    onChange(selectedItem); // Pass the selected option back to the parent component
  };

  return (
    <div className="relative w-fit xl:w-32 font-medium text-sm">
      <div
        onClick={() => setOpen(!open)}
        className={`flex bg-white drop-shadow-md rounded-md px-2 py-2 text-sm items-center justify-between cursor-pointer ${
          !item && "md:text-gray-500"
        }`}
      >
        <div className="flex gap-1">
          <IconComponent size={20} className="hidden xl:block" />
          <span className="truncate hidden xl:block">
            {item ? item : placeholder}
          </span>
        </div>
        <BiChevronDown
          size={20}
          className={`${open && "rotate-180"} hidden xl:block`}
        />

        <IconComponent className="size-[18px] sm:size-5 block xl:hidden" />
      </div>
      <div
        className={` absolute z-10 bg-white drop-shadow-md rounded-md mt-2 w-32 overflow-y-auto max-h-60 right-0 ${
          open ? "block" : "hidden"
        }`}
      >
        <ul>
          {option && option.map((i) => (
            <li
              key={i}
              onClick={() => {
                handleItemClick(i);
              }}
              className="p-2 hover:bg-green-900 hover:text-white"
            >
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDown;
