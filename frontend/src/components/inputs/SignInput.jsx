const SignInput = ({ item, type, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={item} className="text-sm text-gray-800">
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </label>
      <input
        type={type}
        id={item}
        value={value}
        onChange={onChange}
        className="w-full border-2 min-h-11 tracking-wider outline-none duration-3000 rounded-sm pl-3 text-sm focus:outline-active focus:border-none"
        placeholder={`Enter your ${item}`}
        required
      />
    </div>
  );
};

export default SignInput;
