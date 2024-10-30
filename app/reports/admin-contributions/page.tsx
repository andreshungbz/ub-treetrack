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
  title: "Report | Administrator Contributions",
  description: "Administrators by order of plants added and edits made",
};

export default async function AdminContributions() {
  const supabase = await createSupabaseServerComponentClient();

  const getAdministratorContributions = async () => {
    const { data, error } = await supabase.from("administrators").select(`
        admin_id,
        first_name,
        last_name,
        email,
        edits,
        plants:plants (count)
      `);

    if (error) {
      console.error("Error fetching administrator contributions:", error);
      return null;
    }

    return data
      .map((admin) => ({
        ...admin,
        plants_added: admin.plants[0].count,
      }))
      .sort((a, b) => b.plants_added + b.edits - (a.plants_added + a.edits));
  };

  const admins = await getAdministratorContributions();

  return (
    <>
      <h1 className="h1-main">Administrator Contributions</h1>
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
          Administrators sorted by total contributions. Total contributions
          represents the sum of plants added and edits made.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Plants Added</TableHead>
            <TableHead className="text-right">Edits Made</TableHead>
            <TableHead className="text-right">Total Contributions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.map((admin) => (
            <TableRow key={admin.admin_id} className="even:bg-gray-100">
              <TableCell className="font-medium">{`${admin.first_name} ${admin.last_name}`}</TableCell>
              <TableCell>
                <a
                  href={`mailto:${admin.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {admin.email}
                </a>
              </TableCell>
              <TableCell className="text-right">
                {admin.plants[0].count}
              </TableCell>
              <TableCell className="text-right">{admin.edits}</TableCell>
              <TableCell className="text-right">
                {admin.plants[0].count + admin.edits}
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
