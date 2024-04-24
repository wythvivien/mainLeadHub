import { FaSuitcase } from "react-icons/fa";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

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
const ValueBox = () => {
  return (
    <div className="flex flex-col h-full">
      <h1 className=" text-green-900 font-bold text-lg">Deals Value</h1>
      <div className="flex-grow flex items-center gap-5 justify-center -mt-3">
        <div className="flex items-center gap-2">
          <span className="text-5xl font-bold">9</span>
          <FaSuitcase className="size-10" />
        </div>
        <ResponsiveContainer width="50%" height="70%">
          <LineChart data={data}>
            <Tooltip
              contentStyle={{
                background: "transparent",
                border: "none",
                fontSize: "14px",
              }}
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
  );
};

export default ValueBox;
