"use client";

import { Card } from "@/components/ui/card";
import React, { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
}
const Chart: FC<ChartProps> = ({ data }) => {
  return (
    <Card className="flex items-center justify-center text-center h-full">
      {data.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#88888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#88888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar dataKey="total" fill="#0369a1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
      {data.length === 0 && (
        <div className=" text-center h-full p-5">No data to display</div>
      )}
    </Card>
  );
};

export default Chart;
