"use client";

import "@/styles/main.css";

import { useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image"; // used for lazy loading images

export default function FrontCarousel() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  // array of image paths
  const imagePaths = [
    "/carousel/gazebo-area.webp",
    "/carousel/fst-office-outskirts.webp",
    "/carousel/evening-sun.webp",
    "/carousel/sunny-afternoon.webp",
    "/carousel/sunset.webp",
  ];

  return (
    <section className="front-carousel">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-xs"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {imagePaths.map((path, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="relative flex aspect-square items-center justify-center p-6">
                    <Image
                      src={path}
                      alt={`Slide ${index + 1}`}
                      layout="fill"
                      className="rounded-md object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p>
        <span className="ubtt-title">The UB TreeTrack Project</span> aims to
        enhance biodiversity awareness at the{" "}
        <a href="https://www.ub.edu.bz/" className="ub-link">
          University of Belize
        </a>
        . The project&apos;s primary goal is to educate the students, faculty,
        and visitors about the diverse plant species on campus through an
        interactive platform. It also aims to promote the importance of
        biodiversity conservation and sustainable practices within not only the
        university but the wider community as well.
        <br />
        <br />
        The project site boasts a curated{" "}
        <a href="plants/" className="plants-link">
          database
        </a>{" "}
        of the plant species found on the campus in alphabetical order. Each
        plant entry includes the plant&apos;s scientific name, common name,
        description, and images. This database will be continuously updated as
        new species are identified on campus.
        <br />
        <br />
      </p>
    </section>
  );
}
