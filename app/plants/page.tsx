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

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { Metadata } from "next";

// metadata
export const metadata: Metadata = {
  title: "Plants List",
  description: "List of plants in UB TreeTrack",
};

export default async function Plants() {
  const supabase = createSupabaseServerComponentClient();

  const { data: plants, error } = await supabase
    .from("plants")
    .select("plant_id, scientific_name, last_modified");

  if (error) {
    console.error("Error fetching scientific names:", error);
  }

  // sort plants array in alphabetical order by scientific_name
  const sortedPlants = plants?.sort((a, b) =>
    a.scientific_name.localeCompare(b.scientific_name),
  );

  return (
    <>
      <h1 className="h1-main">Plants List</h1>
      <Table className="mx-auto mt-4 bg-white md:w-2/3">
        <TableCaption>
          Table of all plants in the database in alphabetical order. Click on
          the Scientific Name to view its dedicated page.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Scientific Name</TableHead>
            <TableHead className="text-right">Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlants?.map((plant) => (
            <TableRow key={plant.plant_id} className="even:bg-gray-100">
              <TableCell className="font-medium">
                <Link href={`/plant/${plant.plant_id}`}>
                  <span className="text-blue-600 hover:underline">
                    {plant.scientific_name}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                {new Date(plant.last_modified).toLocaleString("en-US", {
                  timeZone: "America/Belize",
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
