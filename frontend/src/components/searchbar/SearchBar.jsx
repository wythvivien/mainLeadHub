import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="flex h-full items-center font-medium text-sm border-2 rounded-md px-2 bg-white">
      <AiOutlineSearch size={20} className="text-gray-500" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search your leads"
        className="placeholder:text-gray-500 p-2 outline-none w-full"
      />
    </div>
  );
};

export default SearchBar;
