import { useListLeadsColumnQuery } from "../../app/api/columnApiSlice";
import { useGetUserTasksQuery } from "../../app/api/calendarApiSlice";
import PipelineBox from "../../components/boxes/PipelineBox";
import ChartBox from "../../components/boxes/ChartBox";
import { BsSnow3 } from "react-icons/bs";
import { RiFireLine } from "react-icons/ri";
import { LiaSkullCrossbonesSolid } from "react-icons/lia";
import BarChartBox from "../../components/boxes/BarChartBox";
import TaskBox from "../../components/boxes/TaskBox";
import PieChartBox from "../../components/boxes/PieChartBox";
import ValueBox from "../../components/boxes/ValueBox";
import ContractsBox from "../../components/boxes/ContractsBox";

const Dashboard = () => {
  const { data: pipelineLeads } = useListLeadsColumnQuery();
  const { data: tasks } = useGetUserTasksQuery();

  return (
    <div className="p-8 min-h-full max-h-fit  bg-slate-100 w-full">
      <div className="flex flex-col gap-5 h-fit w-full relative">
        <h1 className="hidden md:block font-semibold text-green-900 text-2xl -mt-3">
          Dashboard
        </h1>
      </div>
      <div className="py-5 min-h-full whitespace-nowrap grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 grid-flow-row-dense auto-rows-[minmax(180px,auto)]">
        <div className="border-2 rounded-lg p-4 bg-white">
          <ChartBox status="Warm" icon={RiFireLine} number={12} percentage="20%" />
        </div>
        <div className="border-2 rounded-lg p-4 bg-white">
          <ChartBox status="Cold" icon={BsSnow3} number={8} percentage="20%" />
        </div>
        <div className="border-2 rounded-lg p-4 bg-white">
          <ChartBox status="Dead" icon={LiaSkullCrossbonesSolid} number={16} percentage="20%" />
        </div>
        <div className="border-2 rounded-lg p-4 row-span-2 bg-white">
          <PieChartBox />
        </div>
        <div className="border-2 rounded-lg row-span-3 bg-white overflow-y-auto">
          <PipelineBox pipelineLeads={pipelineLeads} />
        </div>
        <div className="border-2 rounded-lg p-5 col-span-2 row-span-2 bg-white">
          <BarChartBox />
        </div>
        <div className="border-2 rounded-lg row-span-2 bg-white">
          <TaskBox tasks={tasks} />
        </div>
        <div className="border-2 rounded-lg p-4 bg-white"><ValueBox /></div>
        <div className="border-2 rounded-lg p-4 bg-white"><ContractsBox /></div>
      </div>
    </div>
  );
};

export default Dashboard;
