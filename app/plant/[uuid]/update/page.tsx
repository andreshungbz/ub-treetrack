import "@/styles/main.css";

import PlantUpdateForm from "@/components/update-form";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// metadata
export const metadata: Metadata = {
  title: "Update Plant",
  description: "Update a plant in the UB TreeTrack database",
};

export default async function UpdatePlant(props: {
  params: Promise<{ uuid: string }>;
}) {
  const params = await props.params;
  const supabase = await createSupabaseServerComponentClient();

  // fetch plant information from Supabase
  const { data: plant, error } = await supabase
    .from("plants")
    .select("*")
    .eq("plant_id", params.uuid)
    .single();

  if (error) {
    console.error("Error fetching plant data:", error);
    return <p>Error loading plant data.</p>;
  }

  return (
    <>
      <h1 className="h1-main">Update Plant</h1>
      <PlantUpdateForm plant={plant} />
      <div className="mt-4 text-center">
        <Link href={`/plant/${plant.plant_id}`}>
          <Button variant="outline" className="w-full sm:w-2/3">
            Cancel
          </Button>
        </Link>
      </div>
    </>
  );
}
