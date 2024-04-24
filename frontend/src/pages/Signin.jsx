import { SiHandshakeProtocol } from "react-icons/si";

const Signin = () => {

  
  const loginwithgoogle = () => {
    window.open("http://localhost:8000/auth/google/callback", "_self");
    
  };

  return (
    <main className="border-4 rounded-md flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 sm:px-10 md:px-12 py-8">
      <div className="flex justify-end gap-3">
        <SiHandshakeProtocol size={32} className="text-active" />
        <h1 className="hidden sm:block text-2xl font-black text-sidebar">
          LEADHUB
        </h1>
      </div>
      <div className="mb-8 -mt-2 flex flex-col font-medium">
        <h1 className="text-gray-800 text-3xl mt-8 mb-4 font-black">Sign In</h1>
        <h2 className="text-gray-500 text-base">
          To access LeadHub, you will need to sign in <br className="hidden lg:block"></br>with your Google account to continue.
        </h2>
      </div>
      <button
        className="py-2.5 border rounded-md text-sidebar text-base font-bold bg-active "
        onClick={loginwithgoogle}
      >
        Google Sign In
      </button>
    </main>
  );
};

export default Signin;
