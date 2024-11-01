"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart with a label";

const chartConfig = {
  plants: {
    label: "Plants/QR",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PlantQRTrendChart({
  chartData,
}: {
  chartData: { month: string; plants: number }[];
}) {
  // calculate the trend percentage
  const currentMonth = chartData[5].plants;
  const lastMonth = chartData[4].plants;
  const trendPercentage =
    lastMonth !== 0
      ? ((currentMonth - lastMonth) / lastMonth) * 100
      : currentMonth > 0
        ? 100
        : 0;

  // determine trend direction and icon
  let trendIcon;
  let trendText;
  if (trendPercentage > 0) {
    trendIcon = <TrendingUp className="h-4 w-4 text-green-500" />;
    trendText = `Trending up by ${Math.abs(trendPercentage).toFixed(1)}% this month compared to last month`;
  } else if (trendPercentage < 0) {
    trendIcon = <TrendingDown className="h-4 w-4 text-red-500" />;
    trendText = `Trending down by ${Math.abs(trendPercentage).toFixed(1)}% this month compared to last month`;
  } else {
    trendIcon = <Minus className="h-4 w-4 text-gray-500" />;
    trendText = "No change in trend this month";
  }

  return (
    <Card className="mx-auto mt-4 w-full text-center sm:w-4/5">
      <CardHeader>
        <CardTitle>Plant/QR Codes Submitted</CardTitle>
        <CardDescription>{`${chartData[0].month} - ${chartData[5].month}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="plants" fill="var(--color-plants)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trendText} {trendIcon}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing monthly plants for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
