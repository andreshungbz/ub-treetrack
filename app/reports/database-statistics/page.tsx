import "@/styles/main.css";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { Metadata } from "next";

// metadata
export const metadata: Metadata = {
  title: "Report | System Database Statistics",
  description: "General statistics about the system database",
};

export default async function DatabaseStatistics() {
  const supabase = await createSupabaseServerComponentClient();

  const getDatabaseStatistics = async () => {
    const { count: plantCount, error: plantError } = await supabase
      .from("plants")
      .select("plant_id", { count: "exact", head: true });

    const { count: ratingCount, error: ratingError } = await supabase
      .from("ratings")
      .select("rating_id", { count: "exact", head: true });

    const { count: adminCount, error: adminError } = await supabase
      .from("administrators")
      .select("admin_id", { count: "exact", head: true });

    if (plantError || ratingError || adminError) {
      console.error("Error fetching database statistics:", {
        plantError,
        ratingError,
        adminError,
      });
      return null;
    }

    return {
      totalPlants: plantCount,
      totalRatings: ratingCount,
      totalAdministrators: adminCount,
    };
  };

  const databaseStatistics = await getDatabaseStatistics();

  const statisticsArray = Object.entries(databaseStatistics ?? "").map(
    ([key, value]) => ({
      name: key.replace("total", "").trim(),
      total: value,
    }),
  );

  return (
    <>
      <h1 className="h1-main">System Database Statistics</h1>
      <div className="text-center text-sm text-gray-500">{`${new Date().toLocaleDateString(
        "en-US",
        {
          timeZone: "America/Belize",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        },
      )}`}</div>
      <Table className="mx-auto mt-4 bg-white md:w-2/3">
        <TableCaption>
          Counts of Plants, Administrators, and Ratings in the system database.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Statistic</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statisticsArray?.map((stat) => (
            <TableRow key={stat.name} className="even:bg-gray-100">
              <TableCell className="font-medium">{`${stat.name} Count`}</TableCell>
              <TableCell className="text-right">{stat.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 text-center">
        <Link href="/reports">
          <Button variant="outline">Back to Reports</Button>
        </Link>
      </div>
    </>
  );
}
