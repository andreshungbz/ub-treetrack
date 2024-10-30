// Plant page

import "@/styles/plant-page.css";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import PlantOptions from "@/components/plant-options";
import Rating from "@/components/rating";

type Plant = {
  id: string;
  scientific_name: string;
  common_names: string;
  description: string;
  photo_link: string;
  imgur_hash: string;
  last_modified: string;
};

type QRCode = {
  qr_id: string;
  plant_id: string;
  qr_image: string;
  qr_destination: string;
  created_at: string;
};

type Rating = {
  rating_id: string;
  plant_id: string;
  rating_value: number;
  created_at: string;
};

async function getPlant(uuid: string): Promise<Plant | null> {
  const supabase = createSupabaseServerClient();

  const { data: plant, error } = await supabase
    .from("plants")
    .select("*")
    .eq("plant_id", uuid)
    .single();

  if (error) {
    return null;
  }

  return plant;
}

async function getQRCode(uuid: string): Promise<QRCode | null> {
  const supabase = createSupabaseServerClient();

  const { data: qrCode, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("plant_id", uuid)
    .single();

  if (error) {
    return null;
  }

  return qrCode;
}

async function getPlantRatings(uuid: string): Promise<Rating[] | null> {
  const supabase = createSupabaseServerClient();

  const { data: plantRatings, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("plant_id", uuid);

  if (error) {
    return null;
  }

  return plantRatings;
}

export async function generateMetadata(props: {
  params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const plant = await getPlant(params.uuid);

  if (!plant) {
    return {
      title: "Plant Not Found",
    };
  }

  return {
    title: plant.scientific_name,
  };
}

export default async function PlantPage(props: {
  params: Promise<{ uuid: string }>;
}) {
  const params = await props.params;
  const plant = await getPlant(params.uuid);
  if (!plant) {
    notFound();
  }

  const qrCode = await getQRCode(params.uuid);
  if (!qrCode) {
    notFound();
  }

  const plantRatings = await getPlantRatings(params.uuid);
  if (!plantRatings) {
    notFound();
  }

  const {
    data: { user },
  } = await createSupabaseServerClient().auth.getUser();

  return (
    <>
      <article className="card">
        <h1 className="plant-name">{plant.scientific_name}</h1>
        <p className="information-small mb-4 mt-2">
          {JSON.parse(plant.common_names).join(", ")}
        </p>
        {plant.photo_link && (
          <Image
            src={plant.photo_link}
            alt={plant.scientific_name}
            width={500}
            height={500}
            className="plant-image"
          />
        )}
        <Rating plantId={params.uuid} plantRatings={plantRatings} />
        <PlantOptions
          user={user}
          plantId={params.uuid}
          imageHash={plant.imgur_hash}
          qrCode={qrCode}
        />

        <h2 className="information-title mt-4 uppercase">{`Description of ${plant.scientific_name}`}</h2>
        <p className="w-full" style={{ whiteSpace: "pre-wrap" }}>
          {plant.description}
        </p>
        <p className="information-small mt-4">
          Last Modified:{" "}
          {new Date(plant.last_modified).toLocaleString("en-US", {
            timeZone: "America/Belize",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </p>
      </article>
      <div className="mt-4 text-center">
        <Link href="/plants">
          <Button variant="outline">Back to Plants</Button>
        </Link>
      </div>
    </>
  );
}
