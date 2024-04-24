import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const BarChartBox = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-5 ">
        <h1 className=" text-green-900 font-bold text-xl">
          Lead Generation Report
        </h1>
        <div className="flex-col">
          <span>Avg.per month</span>
          <p>36 LEADS</p>
        </div>
      </div>

      <div className="flex-grow ">
        <div className="h-full w-full">
          <ResponsiveContainer width="99%" height="100%">
            <BarChart data={data}>
              <Tooltip
                contentStyle={{ background: "#2a3447", borderRadius: "5px" }}
                labelStyle={{ display: "none" }}
                cursor={{ fill: "none" }}
              />
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarChartBox;
