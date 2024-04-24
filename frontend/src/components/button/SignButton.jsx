const SignButton = ({ text}) => {
  return (
    <button
      type="submit"
      className="bg-active text-sidebar font-semibold border whitespace-nowrap mt-6 text-md tracking-wider py-2 outline-none border-none cursor-pointer rounded-lg transition-all duration-200 ease-in-out shadow-md"
    >
      {text}
    </button>
  );
};

export default SignButton;
