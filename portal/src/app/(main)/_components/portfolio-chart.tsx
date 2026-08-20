"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Portfolio value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface PortfolioChartProps {
  data: ReadonlyArray<{ month: string; value: number }>;
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 8 }}>
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-foreground/10" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickFormatter={(v: number) => `GHS ${(v / 1000).toFixed(0)}k`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" labelKey="month" />} />
        <Area
          dataKey="value"
          type="natural"
          fill="url(#fillValue)"
          stroke="var(--chart-1)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}