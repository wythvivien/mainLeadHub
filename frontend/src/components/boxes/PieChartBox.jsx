import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Mobile", value: 400, color: "#0088FE" },
  { name: "Desktop", value: 300, color: "#00C49F" },
  { name: "Laptop", value: 300, color: "#FFBB28" },
  { name: "Tablet", value: 200, color: "#FF8042" },
];

const PieChartBox = () => {
    return (
      <div className="flex flex-col h-full">
        <h1 className=" text-green-900 font-bold text-lg">Lead Source</h1>
        <div className="flex-grow flex flex-col ">
            <div className=" flex justify-center items-center h-full  w-full">
              <ResponsiveContainer width="99%" height="80%">
                <PieChart>
                  <Tooltip
                    contentStyle={{ background: "white", borderRadius: "5px" }}
                  />
                  <Pie
                    data={data}
                    innerRadius={"70%"}
                    outerRadius={"90%"}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="px-4 my-4 flex justify-between text-sm ">
              {data.map((item) => (
                <div className="option" key={item.name}>
                  <div className="title">
                    <div
                      className="dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
        </div>
      </div>
    );
};

export default PieChartBox;
