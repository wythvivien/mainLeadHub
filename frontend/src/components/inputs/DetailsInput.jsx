import React from 'react'

const DetailsInput = ({ item, value, onChange }) => {
  return (
    <div className="flex gap-3 text-gray-600">
      <label htmlFor={item} className="font-medium ">
        {item}:
      </label>
      <input
        type="text"
        value={value}
        id={item}
        onChange={onChange}
        className="border w-2/5 rounded-sm bg-stone-50 outline-none "
      />
    </div>
  );
};


export default DetailsInput