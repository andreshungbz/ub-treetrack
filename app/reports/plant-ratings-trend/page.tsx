import "@/styles/main.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { RatingsTrendChart } from "@/components/ratings-trend-chart";
import { Metadata } from "next";

// metadata
export const metadata: Metadata = {
  title: "Report | Plant Ratings Trend",
  description:
    "Number of ratings entered into the system per month in the last 6 months",
};

export default async function PlantRatingsTrend() {
  const supabase = await createSupabaseServerComponentClient();

  // calculate the date 5 months ago from the current date
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
  fiveMonthsAgo.setDate(1); // Set to the first day of the month

  // fetch ratings data for the last 6 months (including current month)
  const { data, error } = await supabase
    .from("ratings")
    .select("created_at")
    .gte("created_at", fiveMonthsAgo.toISOString())
    .order("created_at");

  if (error) {
    console.error("Error fetching ratings data:", error);
  }

  // generate an array of the last 6 months including the current month
  const last6Months: string[] = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(fiveMonthsAgo);
    date.setMonth(date.getMonth() + i);
    last6Months.push(
      date.toLocaleString("default", { month: "long", year: "numeric" }),
    );
  }

  // process the data into the format expected by the chart
  const ratingsByMonth: { [key: string]: number } = (data ?? []).reduce(
    (acc: { [key: string]: number }, { created_at }) => {
      const monthYear = new Date(created_at).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    },
    {},
  );

  // ensure all months are included, even if there are no ratings
  const chartData = last6Months.map((month) => ({
    month,
    ratings: ratingsByMonth[month] || 0,
  }));

  const currentDate = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Belize",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  // mock data for testing
  // const chartData2 = [
  //   { month: "January", ratings: 186 },
  //   { month: "February", ratings: 305 },
  //   { month: "March", ratings: 237 },
  //   { month: "April", ratings: 73 },
  //   { month: "May", ratings: 209 },
  //   { month: "June", ratings: 214 },
  // ];

  return (
    <>
      <h1 className="h1-main">Plant Ratings Trend</h1>
      <div className="text-center text-sm text-gray-500">{currentDate}</div>
      <RatingsTrendChart chartData={chartData} />
      <div className="mt-4 text-center">
        <Link href="/reports">
          <Button variant="outline">Back to Reports</Button>
        </Link>
      </div>
    </>
  );
}
