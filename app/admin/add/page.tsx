import "@/styles/main.css";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import PlantAddForm from "@/components/add-form";
import { Metadata } from "next";

// metadata
export const metadata: Metadata = {
  title: "Add Plant",
  description: "Add a new plant to the UB TreeTrack database",
};

export default async function AddPlant() {
  const supabase = await createSupabaseServerComponentClient();

  const { data: plants, error } = await supabase
    .from("plants")
    .select("scientific_name");

  if (error) {
    console.error("Error fetching scientific names:", error);
  }

  const scientificNamesArray =
    plants?.map(
      (plant: { scientific_name: string }) => plant.scientific_name,
    ) || [];

  return (
    <>
      <h1 className="h1-main">Add Plant</h1>
      <PlantAddForm existingNames={scientificNamesArray} />
    </>
  );
}
