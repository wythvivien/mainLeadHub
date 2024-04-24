
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

import { LuUsers2 } from "react-icons/lu";
import { BiChevronDown } from "react-icons/bi";

const data = [
  {
    name: "Page A",
    uv: 4000,
    leads: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    leads: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    leads: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    leads: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    leads: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    leads: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    leads: 4300,
    amt: 2100,
  },
];
const ChartBox = ({ status, icon: IconComponent, number, percentage}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 justify-between  ">
        <div className="flex flex-col h-full ">
          <div className="flex items-center gap-2 text-green-900 ">
            <IconComponent className="size-7" />
            <p className="font-bold text-xl tracking-tight">{status} Leads</p>
          </div>
          <div className="flex flex-1 items-center gap-3">
            <span className="text-4xl font-bold">{number}</span>
            <LuUsers2 className="size-12" />
          </div>
        </div>
        <div className="h-3/4 w-2/4 ">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={data}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none", fontSize: "14px" }}
                labelStyle={{ display: "none" }}
                position={{ x: 70, y: 70 }}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#8884d8"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-3 font-semibold">
        <p>Since last week</p>
        <div className="flex bg-slate-200 px-2 gap-2 rounded-sm text-sm items-center">
          <p>{percentage}</p>
          <BiChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default ChartBox;
