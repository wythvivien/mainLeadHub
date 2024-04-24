import { TbCurrencyPeso } from "react-icons/tb";

const PipelineBox = ({ pipelineLeads }) => {
  const capitalizeName = (name) => {
    if (name && name.trim() !== "") {
      const words = name.split(" ");
      const capitalizedName = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
      return capitalizedName.join(" ");
    } else {
      return ""; // Return empty string if name is undefined or empty
    }
  };

  return (
    <div className="overflow-y-auto">
      <div className="flex border-b-2 px-5 py-4 items-center justify-between ">
        <h1 className=" text-green-900 font-bold text-lg">Pipeline Leads</h1>
        <p className="text-green-900 text-sm font-semibold">View All</p>
      </div>
      <div className="px-5 py-4 flex flex-col gap-5">
        {pipelineLeads?.map((leads) =>
          leads.leads.map((lead, index) => (
            <div className="flex justify-between items-center" key={index}>
              <div className="flex items-center gap-2" key={index}>
                <img
                  src={lead.image}
                  alt={lead.account}
                  className="size-10 rounded-full"
                />
                <div className="flex flex-col">
                  <h1 className="hidden 3xl:block text-green-900 font-semibold text-base">
                    {capitalizeName(lead.account)}
                  </h1>
                  <h1 className="3xl:hidden text-green-900 font-semibold text-base">
                    {capitalizeName(lead.account.split(" ")[lead.account.split(" ").length - 1])}
                  </h1>

                  <p className="text-gray-500 font-medium text-sm">
                    Stage: {leads.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <TbCurrencyPeso size={20} />
                <p className="font-bold text-sm -ml-0.5">{lead.oppVal}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PipelineBox;
