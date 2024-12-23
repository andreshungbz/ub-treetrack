import "@/styles/main.css";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import FrontCarousel from "@/components/front-carousel";

export default async function Home() {
  return (
    <>
      <h1 className="h1-main">The University of Belize TreeTrack Project</h1>
      <Alert className="mx-auto mt-4 w-11/12 opacity-90">
        <AlertTitle>Important Note!</AlertTitle>
        <AlertDescription>
          UB TreeTrack is currently a prototype in active development. UI and
          functionality may change at any time.
        </AlertDescription>
      </Alert>
      <FrontCarousel />
    </>
  );
}
