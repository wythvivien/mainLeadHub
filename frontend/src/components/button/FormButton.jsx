import React from 'react'

const FormButton = ({text, onClick}) => {
  return (
    <button
      className={`text-white bg-sidebar px-6 py-2 text-sm rounded-md font-medium tracking-wide outline-none border-none cursor-pointer whitespace-nowrap transition-all duration-200 ease-in-out`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default FormButton