import "@/styles/main.css";
import "@/styles/nature-walk.css";

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

import { Database } from "@/types/supabase";
import { Metadata } from "next";
type Plant = Database["public"]["Tables"]["plants"]["Row"];

// metadata
export const metadata: Metadata = {
  title: "The Nature Walk",
  description: "Explore the nature walk at the University of Belize Campus",
};

export default async function AddPlant() {
  const supabase = await createSupabaseServerComponentClient();

  const { data: plants, error } = await supabase.rpc("get_random_plants");

  if (error) {
    console.error("Error fetching plants:", error);
  }

  return (
    <>
      <h1 className="h1-main">The Nature Walk</h1>
      <p>
        The nature walk is a tour of the{" "}
        <a href="https://www.ub.edu.bz/" className="ub-link">
          University of Belize
        </a>{" "}
        campus that takes students and visitors through a curated path
        containing a variety of plants native to not only the UB campus, but
        also to Belize. The path has been expertly designed by{" "}
        <a
          href="https://www.researchgate.net/profile/Latha-Thomas"
          className="prof-link"
        >
          Dr. Latha Thomas
        </a>{" "}
        to showcase the rich biodiversity and beauty that can be found on the UB
        campus. This serves as a great opportunity to admire the beauty provided
        by the natural world, while also learning interesting facts about the
        plants that you will encounter.
        <br />
        <br />
        The following are a few of the plants that you may encounter on your
        journey through the nature walk. Feel free to click on any of the plants
        to learn more about them!
      </p>
      <div className="nature-grid">
        {plants?.map((plant: Plant) => (
          <Card key={plant.plant_id} className="nature-card">
            <Link href={`/plant/${plant.plant_id}`}>
              <CardHeader>
                <Image
                  src={plant.photo_link}
                  alt={plant.scientific_name}
                  width={300}
                  height={300}
                  className="nature-image"
                />
              </CardHeader>
              <CardContent className="text-center">
                <h2 className="nature-heading">{plant.scientific_name}</h2>
                <p className="nature-description">
                  {(plant.description?.length ?? 0) > 100
                    ? `${plant.description?.substring(0, 100)} ...`
                    : plant.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
