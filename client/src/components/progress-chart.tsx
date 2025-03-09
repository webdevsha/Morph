import { useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card } from "@/components/ui/card";

type Progress = {
  date: string;
  value: number;
  topic: string;
}[];

type ProgressChartProps = {
  progress?: Progress;
}

export function ProgressChart({ progress = [] }: ProgressChartProps) {
  const chartData = progress.length > 0 ? progress : [
    { date: "Week 1", value: 20, topic: "Fundamentals" },
    { date: "Week 2", value: 35, topic: "Risk Assessment" },
    { date: "Week 3", value: 50, topic: "Policy Framework" },
    { date: "Week 4", value: 65, topic: "Technical Implementation" },
  ];

  return (
    <Card className="p-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              stroke="#888888"
              fontSize={12}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--primary))",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{data.topic}</span>
            <span className="font-medium">{data.value}% Complete</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
