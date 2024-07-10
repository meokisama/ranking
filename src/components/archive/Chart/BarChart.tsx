"use client";
import { TrendingUp } from "lucide-react";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
const chartData = [
  { year: "2018", firstHalf: 214, secondHalf: 140 },
  { year: "2019", firstHalf: 186, secondHalf: 80 },
  { year: "2020", firstHalf: 305, secondHalf: 200 },
  { year: "2021", firstHalf: 237, secondHalf: 120 },
  { year: "2022", firstHalf: 73, secondHalf: 190 },
  { year: "2023", firstHalf: 209, secondHalf: 130 },
  { year: "2024", firstHalf: 311, secondHalf: 0 },
];

const chartConfig = {
  firstHalf: {
    label: "Nửa đầu",
    color: "hsl(var(--chart-1))",
  },
  secondHalf: {
    label: "Nửa sau",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Chart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-gray-700">Số lượng bình chọn</CardTitle>
        <CardDescription className="lg:text-xl">
          Từ 2018 - Hiện tại
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}
              className="lg:text-xl"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend
              className="lg:text-xl"
              content={<ChartLegendContent />}
            />
            <Bar dataKey="firstHalf" fill="var(--color-firstHalf)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
            <Bar dataKey="secondHalf" fill="var(--color-secondHalf)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium lg:text-2xl leading-none">
          Tăng trưởng thêm 5.2% trong năm nay{" "}
          <TrendingUp className="h-4 w-4 lg:h-8 lg:w-8" />
        </div>
        <div className="leading-none lg:text-xl text-muted-foreground">
          Đang hiển thị toàn bộ số bình chọn theo mỗi kì qua từng năm
        </div>
      </CardFooter>
    </Card>
  );
}
