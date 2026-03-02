"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

export function CTRChart({
  data
}: {
  data: Array<{ name: string; predicted: number; actual: number }>;
}) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8d5b0" />
          <XAxis dataKey="name" tick={{ fill: "#7a5230", fontSize: 12 }} />
          <YAxis tickFormatter={formatPercent} tick={{ fill: "#7a5230", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#fffcf7",
              border: "1px solid #c8602a",
              borderRadius: 8,
              color: "#3d2410"
            }}
            formatter={(value: number) => formatPercent(value)}
          />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#5c3a1e" }} />
          <Bar
            dataKey="predicted"
            name="Predicted CTR"
            fill="#d4b896"
            radius={[6, 6, 0, 0]}
            animationBegin={120}
            animationDuration={700}
          />
          <Bar
            dataKey="actual"
            name="Actual CTR"
            fill="#c8602a"
            radius={[6, 6, 0, 0]}
            animationBegin={180}
            animationDuration={780}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
