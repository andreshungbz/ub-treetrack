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
  title: "Report | Plant Popularity",
  description: "Plants by order of rating average",
};

export default async function PlantPopularity() {
  const supabase = await createSupabaseServerComponentClient();

  const getPlantPopularityReport = async () => {
    const { data: plants, error } = await supabase
      .from("plants")
      .select(
        `
        plant_id,
        scientific_name,
        ratings:ratings (count)
      `,
      )
      .order("scientific_name");

    if (error) {
      console.error("Error fetching plant popularity:", error);
      return null;
    }

    const { data: ratings, error: ratingError } = await supabase
      .from("ratings")
      .select("*");

    if (ratingError) {
      console.error("Error fetching plant popularity:", error);
      return null;
    }

    const plantsWithRatings = plants.map((plant) => {
      const plantRatings = ratings.filter(
        (rating) => rating.plant_id === plant.plant_id,
      );
      const ratingCount = plant.ratings[0]?.count || 0; // use the `count` from ratings array

      const averageRating =
        ratingCount > 0
          ? plantRatings.reduce((sum, rating) => sum + rating.rating_value, 0) /
            ratingCount
          : null;

      return {
        ...plant,
        average_rating: averageRating,
        rating_count: ratingCount,
      };
    });

    // sort plants by average rating (highest to lowest)
    return plantsWithRatings.sort(
      (a, b) => (b.average_rating || 0) - (a.average_rating || 0),
    );
  };

  const plants = await getPlantPopularityReport();

  return (
    <>
      <h1 className="h1-main">Plant Popularity Report</h1>
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
          Plants ordered by average rating from highest to lowest.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Plant</TableHead>
            <TableHead className="text-right">Ratings Count</TableHead>
            <TableHead className="text-right">Ratings Average</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plants?.map((plant) => (
            <TableRow key={plant.plant_id} className="even:bg-gray-100">
              <TableCell className="font-medium">
                <Link href={`/plant/${plant.plant_id}`}>
                  <span className="text-blue-600 hover:underline">
                    {plant.scientific_name}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-right">{plant.rating_count}</TableCell>
              <TableCell className="text-right">
                {plant.average_rating?.toFixed(2)}
              </TableCell>
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
